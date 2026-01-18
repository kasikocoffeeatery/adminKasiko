/**
 * Fetch Google Spreadsheet data as CSV via API route
 * Uses Next.js API route as proxy to avoid CORS issues
 * 
 * @param spreadsheetUrl - Google Sheets sharing link
 * @param sheetId - Sheet ID (gid parameter), defaults to 0 for first sheet
 * @returns CSV data as string
 */
export async function fetchGoogleSheetCSV(
  spreadsheetUrl: string,
  sheetId: number = 0
): Promise<string> {
  // Use API route as proxy to avoid CORS issues
  const apiUrl = `/api/sheets?url=${encodeURIComponent(spreadsheetUrl)}&gid=${sheetId}`;
  
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to fetch spreadsheet: ${response.statusText}`);
  }
  
  const result = await response.json();
  return result.data;
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
  sheetId: number = 0
): Promise<AvailabilityRow[]> {
  const csvText = await fetchGoogleSheetCSV(spreadsheetUrl, sheetId);
  const parsed = parseCSV(csvText);
  
  return parsed as AvailabilityRow[];
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
  
  const availablePlaces: string[] = [];
  
  // Check each place type - match exact column names from spreadsheet
  const places = [
    { name: 'Indoor', keys: ['Tersedia Indoor', 'tersedia indoor'] },
    { name: 'Outdoor', keys: ['Tersedia Outdoor', 'tersedia outdoor'] },
    { name: 'Semi Outdoor', keys: ['Tersedia Semi Outdoor', 'tersedia semi outdoor'] },
  ];
  
  // Use a Set to track which place names we've already added
  const addedPlaces = new Set<string>();
  
  places.forEach((place) => {
    // Try each possible key name (case variations)
    for (const key of place.keys) {
      const availableStr = dateRow[key];
      if (availableStr !== undefined && availableStr !== null && availableStr.trim() !== '') {
        // Parse number - remove any non-numeric characters except minus sign
        const cleaned = availableStr.trim().replace(/[^\d-]/g, '');
        const available = parseInt(cleaned, 10);
        
        if (!isNaN(available) && available >= numberOfPeople) {
          if (!addedPlaces.has(place.name)) {
            availablePlaces.push(place.name);
            addedPlaces.add(place.name);
          }
          break; // Found a match, no need to try other keys for this place
        }
      }
    }
  });
  
  console.log('Available places for', selectedDate, numberOfPeople, 'people:', availablePlaces, 'Row data:', dateRow);
  
  return availablePlaces;
}

/**
 * Normalize date string to YYYY-MM-DD format for comparison
 */
function normalizeDate(dateStr: string): string {
  if (!dateStr) return '';
  
  // Try to parse various date formats
  const date = new Date(dateStr);
  
  if (isNaN(date.getTime())) {
    // If parsing fails, try to extract date from string
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return match[0];
    }
    return dateStr.trim();
  }
  
  // Format as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

