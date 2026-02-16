/**
 * Fetch Google Spreadsheet data as CSV via API route
 * Uses Next.js API route as proxy to avoid CORS issues
 * 
 * @param spreadsheetUrl - Google Sheets sharing link
 * @param sheetId - Sheet ID (gid parameter), defaults to 0 for first sheet
 * @returns CSV data as string
 */
import { formatReservationPlaceLabel, reservationTablesById } from '@/data/reservationPlaces';

export async function fetchGoogleSheetCSV(
  spreadsheetUrl: string,
  sheetId: number = 0
): Promise<string> {
  // Use API route as proxy to avoid CORS issues
  const apiUrl = `/api/sheets?url=${encodeURIComponent(spreadsheetUrl)}&gid=${sheetId}`;
  
  const response = await fetch(apiUrl, { cache: 'no-store' });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to fetch spreadsheet: ${response.statusText}`);
  }
  
  const result = await response.json();
  return result.data;
}

export async function fetchGoogleSheetCSVWithHash(
  spreadsheetUrl: string,
  sheetId: number = 0,
  ifHash?: string | null
): Promise<{ csvText: string; hash: string } | { csvText: null; hash: string | null; notModified: true }> {
  const qs = new URLSearchParams({
    url: spreadsheetUrl,
    gid: String(sheetId),
  });
  if (ifHash) qs.set('ifHash', ifHash);

  const apiUrl = `/api/sheets?${qs.toString()}`;
  const response = await fetch(apiUrl, { cache: 'no-store' });

  if (response.status === 304) {
    return { csvText: null, hash: ifHash ?? null, notModified: true };
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to fetch spreadsheet: ${response.statusText}`);
  }

  const result = await response.json();
  return { csvText: result.data, hash: result.hash };
}

/**
 * Simple CSV parser that handles quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  values.push(current.trim());
  return values;
}

/**
 * Parse CSV string to array of objects
 * Preserves original header case but also stores lowercase version for lookup
 * 
 * @param csvText - CSV data as string
 * @returns Array of objects with keys from first row (preserved case)
 */
export function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n').filter(line => line.trim() !== '');
  
  if (lines.length < 2) {
    return [];
  }
  
  // Get headers from first line (preserve original case)
  const headers = parseCSVLine(lines[0]).map((h) => h.trim().replace(/^"|"$/g, ''));
  
  // Parse data rows
  const data: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]).map((v) => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      // Store with original case
      row[header] = value;
      // Also store lowercase version for case-insensitive lookup
      row[header.toLowerCase()] = value;
    });
    
    data.push(row);
  }
  
  return data;
}

/**
 * Interface for spreadsheet row (availability data)
 */
export interface AvailabilityRow {
  Tanggal?: string;
  tanggal?: string;
  'Tersedia Indoor'?: string;
  'tersedia indoor'?: string;
  'Tersedia Outdoor'?: string;
  'tersedia outdoor'?: string;
  'Tersedia Semi Outdoor'?: string;
  'tersedia semi outdoor'?: string;
  [key: string]: string | undefined;
}

/**
 * Fetch and parse Google Spreadsheet availability data
 * 
 * @param spreadsheetUrl - Google Sheets sharing link
 * @param sheetId - Sheet ID (gid parameter)
 * @returns Parsed availability data
 */
export async function fetchAvailabilityData(
  spreadsheetUrl: string,
  sheetId?: number
): Promise<AvailabilityRow[]> {
  const inferredGid = extractGidFromSheetUrl(spreadsheetUrl);
  const resolvedSheetId = typeof sheetId === 'number' ? sheetId : inferredGid ?? 0;

  const csvText = await fetchGoogleSheetCSV(spreadsheetUrl, resolvedSheetId);
  const parsed = parseCSV(csvText);
  
  return parsed as AvailabilityRow[];
}

export async function fetchAvailabilityDataWithHash(
  spreadsheetUrl: string,
  sheetId?: number,
  ifHash?: string | null
): Promise<{ rows: AvailabilityRow[]; hash: string } | { rows: null; hash: string | null; notModified: true }> {
  const inferredGid = extractGidFromSheetUrl(spreadsheetUrl);
  const resolvedSheetId = typeof sheetId === 'number' ? sheetId : inferredGid ?? 0;

  const res = await fetchGoogleSheetCSVWithHash(spreadsheetUrl, resolvedSheetId, ifHash);
  if ('notModified' in res) return { rows: null, hash: res.hash, notModified: true };

  const parsed = parseCSV(res.csvText);
  return { rows: parsed as AvailabilityRow[], hash: res.hash };
}

/**
 * Filter available places based on date and number of people
 * 
 * @param availabilityData - Availability data from spreadsheet
 * @param selectedDate - Selected reservation date (format: YYYY-MM-DD)
 * @param numberOfPeople - Number of people
 * @returns Array of available place names
 */
export function getAvailablePlaces(
  availabilityData: AvailabilityRow[],
  selectedDate: string,
  numberOfPeople: number
): string[] {
  if (!availabilityData || availabilityData.length === 0) {
    console.warn('No availability data found');
    return [];
  }

  // Normalize selected date for comparison
  const normalizedSelected = normalizeDate(selectedDate);
  
  // Find row matching the selected date
  const dateRow = availabilityData.find((row) => {
    // Try all possible date column names
    const dateValue = row.Tanggal || row.tanggal || row['Tanggal'] || '';
    if (!dateValue) return false;
    
    const rowDate = normalizeDate(dateValue);
    return rowDate === normalizedSelected;
  });
  
  if (!dateRow) {
    console.warn('No matching date found:', selectedDate, 'Available dates:', availabilityData.map(r => r.Tanggal || r.tanggal));
    return [];
  }

  // Mode 1 (legacy): availability per area (number of seats available per area)
  const hasAreaColumns =
    typeof dateRow['Tersedia Indoor'] !== 'undefined' ||
    typeof dateRow['tersedia indoor'] !== 'undefined' ||
    typeof dateRow['Tersedia Outdoor'] !== 'undefined' ||
    typeof dateRow['tersedia outdoor'] !== 'undefined' ||
    typeof dateRow['Tersedia Semi Outdoor'] !== 'undefined' ||
    typeof dateRow['tersedia semi outdoor'] !== 'undefined';

  if (hasAreaColumns) {
    const availableAreas: string[] = [];

    // Check each place type - match exact column names from spreadsheet
    const places = [
      { name: 'Indoor', keys: ['Tersedia Indoor', 'tersedia indoor'] },
      { name: 'Outdoor', keys: ['Tersedia Outdoor', 'tersedia outdoor'] },
      { name: 'Semi Outdoor', keys: ['Tersedia Semi Outdoor', 'tersedia semi outdoor'] },
    ];

    const addedPlaces = new Set<string>();

    places.forEach((place) => {
      for (const key of place.keys) {
        const availableStr = dateRow[key];
        if (availableStr !== undefined && availableStr !== null && availableStr.trim() !== '') {
          const cleaned = availableStr.trim().replace(/[^\d-]/g, '');
          const available = parseInt(cleaned, 10);

          if (!isNaN(available) && available >= numberOfPeople) {
            if (!addedPlaces.has(place.name)) {
              availableAreas.push(place.name);
              addedPlaces.add(place.name);
            }
            break;
          }
        }
      }
    });

    console.log('Available areas for', selectedDate, numberOfPeople, 'people:', availableAreas, 'Row data:', dateRow);
    return availableAreas;
  }

  // Mode 2 (new): availability per table/spot, value "Tersedia" / "Tidak tersedia"
  // Spreadsheet headers follow format: "Indoor A1", "Semi Outdoor B1", "Atas G2", etc.
  // Return list of table IDs (e.g. ["A1","B1","G2"]).
  const availableTableIds: string[] = [];

  const isTruthyAvailable = (raw: string) => {
    const v = raw.trim().toLowerCase();
    return v === 'tersedia' || v === 'available' || v === 'ya' || v === 'yes' || v === '1' || v === 'true';
  };

  for (const tableId of Object.keys(reservationTablesById)) {
    const col = formatReservationPlaceLabel(tableId);
    const value = (dateRow[col] ?? dateRow[col.toLowerCase()] ?? '').toString();
    if (value && isTruthyAvailable(value)) {
      availableTableIds.push(tableId);
    }
  }

  console.log('Available tables for', selectedDate, numberOfPeople, 'people:', availableTableIds, 'Row data:', dateRow);
  return availableTableIds;
}

/**
 * Normalize date string to YYYY-MM-DD format for comparison
 */
function normalizeDate(dateStr: string): string {
  if (!dateStr) return '';

  const s = String(dateStr).trim();

  // Exact ISO already present
  const iso = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return iso[0];

  // Common formats from Sheets / locale:
  // - DD/MM/YYYY or D/M/YYYY
  // - DD-MM-YYYY or D-M-YYYY
  const dmy = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (dmy) {
    const day = dmy[1].padStart(2, '0');
    const month = dmy[2].padStart(2, '0');
    const year = dmy[3];
    return `${year}-${month}-${day}`;
  }

  // US-ish: MM/DD/YYYY
  const mdy = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (mdy) {
    // If ambiguous (<=12 both), prefer DD/MM (Indo common) already handled above.
    // This block is mainly for inputs like "2/15/2026" (month/day/year).
    const monthNum = Number(mdy[1]);
    const dayNum = Number(mdy[2]);
    if (monthNum >= 1 && monthNum <= 12 && dayNum >= 13 && dayNum <= 31) {
      const month = String(monthNum).padStart(2, '0');
      const day = String(dayNum).padStart(2, '0');
      const year = mdy[3];
      return `${year}-${month}-${day}`;
    }
  }
  
  // Try to parse various date formats
  const date = new Date(s);
  
  if (isNaN(date.getTime())) {
    return s;
  }
  
  // Format as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

function extractGidFromSheetUrl(url: string): number | null {
  if (!url) return null;
  const match = String(url).match(/[?&#]gid=(\d+)/);
  if (!match) return null;
  const gid = parseInt(match[1], 10);
  return Number.isFinite(gid) ? gid : null;
}

