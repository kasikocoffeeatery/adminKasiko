import { NextRequest, NextResponse } from 'next/server';
import { formatReservationPlaceLabel } from '@/data/reservationPlaces';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function postWebhook(url: string, body: unknown) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    // Optional auth for n8n webhook
    // - If your n8n Webhook node uses "Basic Auth", set N8N_RESERVASI_WEBHOOK_BASIC_USER / _PASS
    // - If it uses "Header Auth" / "JWT", set N8N_RESERVASI_WEBHOOK_AUTHORIZATION (e.g. "Bearer xxx")
    // - Or custom header via N8N_RESERVASI_WEBHOOK_HEADER_NAME / _VALUE
    const basicUser = process.env.N8N_RESERVASI_WEBHOOK_BASIC_USER;
    const basicPass = process.env.N8N_RESERVASI_WEBHOOK_BASIC_PASS;
    if (basicUser && basicPass) {
      const token = Buffer.from(`${basicUser}:${basicPass}`, 'utf8').toString('base64');
      headers.Authorization = `Basic ${token}`;
    }

    const authz = process.env.N8N_RESERVASI_WEBHOOK_AUTHORIZATION;
    if (authz) headers.Authorization = authz;

    const headerName = process.env.N8N_RESERVASI_WEBHOOK_HEADER_NAME;
    const headerValue = process.env.N8N_RESERVASI_WEBHOOK_HEADER_VALUE;
    if (headerName && headerValue) headers[headerName] = headerValue;

    // Small retry for transient network issues
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          signal: controller.signal,
          cache: 'no-store',
        });

        if (res.ok) return;
        // Retry only on upstream temporary errors
        if (res.status === 429 || res.status === 500 || res.status === 502 || res.status === 503 || res.status === 504) {
          await sleep(250 * Math.pow(2, attempt));
          continue;
        }

        const txt = await res.text().catch(() => '');
        throw new Error(`Webhook failed: ${res.status} ${res.statusText} ${txt.slice(0, 200)}`);
      } catch (e) {
        if (attempt === 1) throw e;
        await sleep(250);
      }
    }
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * API route to submit reservation data to Google Sheets via Google Apps Script
 * Note: Google Sheets API requires OAuth2/Service Account for write operations.
 * This route uses Google Apps Script Web App as a proxy for easier setup.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get Google Apps Script Web App URL from environment
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL || '';
    
    if (!scriptUrl) {
      return NextResponse.json(
        { error: 'Google Apps Script URL is not configured. Please set NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL in your environment variables.' },
        { status: 500 }
      );
    }

    // Prepare data to send to Apps Script
    const payload = {
      nama: body.nama || '',
      jumlahOrang: body.jumlahOrang || '',
      // Allow sending either raw id ("B1") or already formatted ("Semi Outdoor B1").
      tempat: formatReservationPlaceLabel(body.tempat || ''),
      tanggal: body.tanggal || '',
      jam: body.jam || '',
      menu: body.menu || '',
      totalHarga: body.totalHarga || '',
      idWa: body.idWa || '',
      noWa: body.noWa || '',
      catatan: body.catatan || '',
    };

    const paymentType = body.paymentType === 'dp' ? 'dp' : 'lunas';

    console.log('Sending data to Google Apps Script:', {
      url: scriptUrl,
      payload: payload,
    });

    // Send POST request to Google Apps Script Web App
    // Note: Google Apps Script may redirect, so we need to handle that
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      redirect: 'follow', // Follow redirects
    });

    const responseText = await response.text();
    console.log('Google Apps Script response:', {
      status: response.status,
      statusText: response.statusText,
      responseText: responseText.substring(0, 500), // Limit log size
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      console.error('Google Apps Script error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      return NextResponse.json(
        { 
          error: 'Failed to submit data to spreadsheet',
          details: errorData.error || errorData.message || 'Unknown error'
        },
        { status: response.status }
      );
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      // If response is not JSON, check if it's HTML (redirect page)
      if (responseText.includes('<html') || responseText.includes('<!DOCTYPE')) {
        console.warn('Google Apps Script returned HTML instead of JSON. This might indicate a redirect or authorization issue.');
        // Still return success, as Google Apps Script might have processed the request
        result = { success: true, warning: 'Response was HTML, but request may have succeeded' };
      } else {
        result = { success: true };
      }
    }
    
    console.log('Google Apps Script result:', result);

    // Trigger n8n webhook (best-effort; won't fail reservation if webhook is down)
    const webhookUrl = process.env.N8N_RESERVASI_WEBHOOK_URL || '';

    const reservationKey = [payload.tanggal, payload.jam, payload.tempat, payload.noWa].filter(Boolean).join('|');
    const webhookPayload = {
      event: 'reservation_created',
      reservationKey,
      paymentType,
      reservation: payload,
      appsScriptResult: result,
      createdAt: new Date().toISOString(),
    };

    if (webhookUrl) {
      postWebhook(webhookUrl, webhookPayload).catch((err) => {
        console.warn('n8n webhook trigger failed:', err);
      });
    } else {
      console.log('n8n webhook skipped (N8N_RESERVASI_WEBHOOK_URL not set)');
    }

    return NextResponse.json({ ...result, reservationKey });
  } catch (error: any) {
    console.error('Error submitting reservation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to submit reservation data',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

