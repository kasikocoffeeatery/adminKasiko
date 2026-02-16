import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

type CacheEntry = { hash: string; data: string; ts: number };
const CACHE_TTL_MS = 10_000;
const sheetCache = new Map<string, CacheEntry>();

function getCacheKey(spreadsheetId: string, gid: string) {
  return `${spreadsheetId}:${gid}`;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function looksLikeHtml(text: string) {
  const s = text.trim().toLowerCase();
  return s.startsWith('<!doctype html') || s.startsWith('<html') || s.includes('<head') || s.includes('<body');
}

async function fetchWithRetry(url: string, init: RequestInit, retries = 2): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, init);
      if (res.status === 429 || res.status === 503 || res.status === 500 || res.status === 502 || res.status === 504) {
        lastErr = new Error(`Upstream temporary error: ${res.status}`);
      } else {
        return res;
      }
    } catch (e) {
      lastErr = e;
    }
    if (attempt < retries) await sleep(250 * Math.pow(2, attempt));
  }
  throw lastErr instanceof Error ? lastErr : new Error('Failed to fetch upstream');
}

/**
 * Convert Google Sheets API v4 response to CSV format
 */
function convertToCSV(values: string[][]): string {
  if (!values || values.length === 0) {
    return '';
  }

  return values.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
}

/**
 * API route to fetch Google Spreadsheet data
 * This acts as a proxy to avoid CORS issues when fetching from client
 * Supports both Google Sheets API v4 (with API key) and CSV export (fallback)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const spreadsheetUrl = searchParams.get('url');
    const sheetId = searchParams.get('gid') || '0';
    const ifHash = searchParams.get('ifHash');

    if (!spreadsheetUrl) {
      return NextResponse.json(
        { error: 'Spreadsheet URL is required' },
        { status: 400 }
      );
    }

    // Extract spreadsheet ID from Google Sheets URL
    // Format: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit...
    const match = spreadsheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);

    if (!match || !match[1]) {
      return NextResponse.json(
        { error: 'Invalid Google Sheets URL' },
        { status: 400 }
      );
    }

    const spreadsheetId = match[1];
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    const cacheKey = getCacheKey(spreadsheetId, sheetId);

    // Short in-memory cache to reduce load and avoid transient empty states.
    const cached = sheetCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      if (ifHash && ifHash === cached.hash) {
        return new NextResponse(null, { status: 304, headers: { 'Cache-Control': 'no-store, max-age=0' } });
      }
      return NextResponse.json(
        { data: cached.data, hash: cached.hash },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    // Try Google Sheets API v4 if API key is available
    if (apiKey) {
      try {
        // Google Sheets API v4 endpoint
        // Note: For API v4, we need the sheet name or A1 notation instead of gid
        // For now, we'll try to get all sheets and use the first one if gid=0
        const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:Z?key=${apiKey}`;

        const response = await fetchWithRetry(apiUrl, { cache: 'no-store' });

        if (response.ok) {
          const data = await response.json();
          
          if (data.values && data.values.length > 0) {
            const csvText = convertToCSV(data.values);
            const hash = createHash('sha1').update(csvText).digest('hex');
            if (ifHash && ifHash === hash) {
              return new NextResponse(null, { status: 304, headers: { 'Cache-Control': 'no-store, max-age=0' } });
            }
            sheetCache.set(cacheKey, { data: csvText, hash, ts: Date.now() });
            return NextResponse.json(
              { data: csvText, hash },
              { headers: { 'Cache-Control': 'no-store, max-age=0' } }
            );
          }
        }
      } catch (apiError) {
        console.warn('Google Sheets API v4 failed, falling back to CSV export:', apiError);
        // Fall through to CSV export method
      }
    }

    // Fallback to CSV export (no API key required, but sheet must be public)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheetId}`;

    const response = await fetchWithRetry(csvUrl, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch spreadsheet: ${response.statusText}` },
        { status: response.status }
      );
    }

    const csvText = await response.text();
    if (looksLikeHtml(csvText)) {
      return NextResponse.json(
        { error: 'Upstream returned HTML (possible rate limit / permission). Please retry.' },
        { status: 502, headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    const hash = createHash('sha1').update(csvText).digest('hex');
    if (ifHash && ifHash === hash) {
      return new NextResponse(null, { status: 304, headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }
    sheetCache.set(cacheKey, { data: csvText, hash, ts: Date.now() });
    return NextResponse.json(
      { data: csvText, hash },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('Error fetching spreadsheet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch spreadsheet data' },
      { status: 500 }
    );
  }
}

