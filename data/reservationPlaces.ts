export type ReservationAreaKey = 'Indoor' | 'Semi Outdoor' | 'Outdoor';

export type TableSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ReservationTable {
  /** Stored into formData.tempat and submitted to Sheets */
  id: string;
  label: string;
  areaKey: ReservationAreaKey;
  minCapacity: number;
  maxCapacity: number;
  size?: TableSize;
}

export interface ReservationZone {
  id: string;
  label: string;
  tables: ReservationTable[];
}

/**
 * Layout meja untuk halaman reservasi.
 * Catatan: availability dari Google Sheets saat ini hanya level area (Indoor/Outdoor/Semi Outdoor),
 * jadi `areaKey` dipakai untuk filter/disable meja berdasarkan area yang tersedia.
 */
export const reservationZones: ReservationZone[] = [
  {
    id: 'indoor',
    label: 'Indoor',
    tables: [
      { id: 'A1', label: 'A1', areaKey: 'Indoor', minCapacity: 10, maxCapacity: 15, size: 'md' },
      { id: 'A2', label: 'A2', areaKey: 'Indoor', minCapacity: 10, maxCapacity: 15, size: 'md' },
      { id: 'A3', label: 'A3', areaKey: 'Indoor', minCapacity: 4, maxCapacity: 7, size: 'md' },
    ],
  },
  {
    id: 'semi-outdoor-kanan',
    label: 'Semi Outdoor: Kanan',
    tables: [
      { id: 'B1', label: 'B1', areaKey: 'Semi Outdoor', minCapacity: 4, maxCapacity: 4, size: 'md' },
      { id: 'B2', label: 'B2', areaKey: 'Semi Outdoor', minCapacity: 4, maxCapacity: 4, size: 'md' },
      { id: 'B3', label: 'B3', areaKey: 'Semi Outdoor', minCapacity: 5, maxCapacity: 8, size: 'md' },
    ],
  },
  {
    id: 'semi-outdoor-kiri',
    label: 'Semi Outdoor: Kiri',
    tables: [
      { id: 'E1', label: 'E1', areaKey: 'Semi Outdoor', minCapacity: 4, maxCapacity: 4, size: 'sm' },
      { id: 'E2', label: 'E2', areaKey: 'Semi Outdoor', minCapacity: 4, maxCapacity: 4, size: 'sm' },
      { id: 'E3', label: 'E3', areaKey: 'Semi Outdoor', minCapacity: 5, maxCapacity: 8, size: 'md' },
    ],
  },
  {
    id: 'semi-outdoor-tengah',
    label: 'Semi Outdoor: Tengah',
    tables: [{ id: 'D1', label: 'D1', areaKey: 'Semi Outdoor', minCapacity: 15, maxCapacity: 23, size: 'xl' }],
  },
  {
    id: 'semi-outdoor-belakang',
    label: 'Semi Outdoor: Belakang',
    tables: [
      { id: 'C1', label: 'C1', areaKey: 'Semi Outdoor', minCapacity: 28, maxCapacity: 45, size: 'full' },
    ],
  },
  {
    id: 'atas-1',
    label: 'Atas 1',
    tables: [
      { id: 'F1', label: 'F1', areaKey: 'Outdoor', minCapacity: 4, maxCapacity: 4, size: 'sm' },
      { id: 'F2', label: 'F2', areaKey: 'Outdoor', minCapacity: 4, maxCapacity: 4, size: 'sm' },
      { id: 'F3', label: 'F3', areaKey: 'Outdoor', minCapacity: 4, maxCapacity: 4, size: 'sm' },
      { id: 'F4', label: 'F4', areaKey: 'Outdoor', minCapacity: 5, maxCapacity: 8, size: 'md' },
      { id: 'F5', label: 'F5', areaKey: 'Outdoor', minCapacity: 5, maxCapacity: 8, size: 'md' },
    ],
  },
  {
    id: 'atas-2',
    label: 'Atas 2',
    tables: [
      // { id: 'G1', label: 'G1', areaKey: 'Outdoor', minCapacity: 4, maxCapacity: 8, size: 'lg' },
      // { id: 'G2', label: 'G2', areaKey: 'Outdoor', minCapacity: 4, maxCapacity: 6, size: 'md' },
      // { id: 'G3', label: 'G3', areaKey: 'Outdoor', minCapacity: 25, maxCapacity: 30, size: 'full' },
      { id: 'G1', label: 'G1', areaKey: 'Outdoor', minCapacity: 0, maxCapacity: 0, size: 'lg' },
      { id: 'G2', label: 'G2', areaKey: 'Outdoor', minCapacity: 0, maxCapacity: 0, size: 'md' },
      { id: 'G3', label: 'G3', areaKey: 'Outdoor', minCapacity: 0, maxCapacity: 0, size: 'full' },
    ],
  },
];

export const reservationTablesById: Record<string, ReservationTable> = Object.fromEntries(
  reservationZones.flatMap((z) => z.tables).map((t) => [t.id, t])
);

/** Format label yang dipakai untuk ditampilkan / disimpan ke Google Sheets (sesuai request: "Semi Outdoor B1", "Atas G2", dll) */
export function formatReservationPlaceLabel(placeId: string) {
  if (!placeId) return '';
  const table = reservationTablesById[placeId];
  if (!table) return placeId;

  const firstChar = placeId.trim().toUpperCase().slice(0, 1);
  const prefix =
    firstChar === 'A'
      ? 'Indoor'
      : ['B', 'C', 'D', 'E'].includes(firstChar)
        ? 'Semi Outdoor'
        : ['F', 'G'].includes(firstChar)
          ? 'Atas'
          : table.areaKey;

  return `${prefix} ${table.label}`;
}


