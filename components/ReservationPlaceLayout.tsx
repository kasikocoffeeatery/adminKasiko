import React from 'react';
import Image from 'next/image';
import { reservationTablesById, ReservationTable } from '@/data/reservationPlaces';

function formatCapacity(table: ReservationTable) {
  if (table.minCapacity === table.maxCapacity) return `${table.maxCapacity} orang`;
  return `${table.minCapacity}–${table.maxCapacity} orang`;
}

function getSeatSizeClass(size?: ReservationTable['size']) {
  // Cinema-like seats: keep most seats uniform & compact.
  // Only upscale for large group areas so they feel different visually.
  switch (size) {
    case 'full':
      return 'h-10 w-full';
    case 'xl':
      return 'h-10 w-24 md:w-28';
    case 'lg':
      return 'h-10 w-20 md:w-24';
    case 'md':
      return 'h-10 w-12 md:w-14';
    case 'sm':
    default:
      return 'h-10 w-10 md:w-12';
  }
}

export default function ReservationPlaceLayout(props: {
  value: string;
  onChange: (nextValue: string) => void;
  jumlahOrang: number | '';
  /** From Google Sheets: list of available table IDs e.g. ["A1","B1","G2"] */
  availableTableIds: string[];
  disabled?: boolean;
}) {
  const { value, onChange, jumlahOrang, availableTableIds, disabled } = props;

  const peopleCount = typeof jumlahOrang === 'number' && Number.isFinite(jumlahOrang) ? jumlahOrang : null;
  const hasPeople = peopleCount !== null && peopleCount > 0;

  const isTableAvailable = (tableId: string) => availableTableIds.includes(tableId);

  const E_GROUP = ['E1', 'E2', 'E3', 'E4'] as const;
  type EGroupId = (typeof E_GROUP)[number];

  const getBaseDisabledReason = (table: ReservationTable): string | null => {
    if (disabled) {
      if (hasPeople && availableTableIds.length === 0) {
        return 'Tidak ada tempat tersedia untuk tanggal & jumlah orang ini';
      }
      return 'Lengkapi tanggal & jumlah orang';
    }
    if (!isTableAvailable(table.id)) return 'Tidak tersedia';
    if (!hasPeople) return null; // allow browsing before input people
    if (peopleCount! < table.minCapacity) return `Minimal ${table.minCapacity} orang`;
    if (peopleCount! > table.maxCapacity) return `Maksimal ${table.maxCapacity} orang`;
    return null;
  };

  const shouldForceDisableEGroup = (tableId: string): boolean => {
    // Special rule (based on Google Sheets availability only):
    // If 3 of E1–E4 are marked "Tidak tersedia" in sheet, force-disable the remaining one.
    if (disabled) return false;
    if (!E_GROUP.includes(tableId as EGroupId)) return false;

    const otherIds = E_GROUP.filter((id) => id !== tableId);
    const unavailableOtherCount = otherIds.reduce((acc, id) => acc + (!isTableAvailable(id) ? 1 : 0), 0);
    return unavailableOtherCount === 3;
  };

  const getDisabledReason = (table: ReservationTable): string | null => {
    const base = getBaseDisabledReason(table);
    if (base !== null) return base;

    if (shouldForceDisableEGroup(table.id)) return 'Tidak tersedia';

    return null;
  };

  const TableButton = (p: { tableId: string; className?: string }) => {
    const table = reservationTablesById[p.tableId];
    if (!table) return null;

    const reason = getDisabledReason(table);
    const enabled = reason === null;
    const selected = value === table.id;

    return (
      <button
        key={table.id}
        type="button"
        onClick={() => enabled && onChange(table.id)}
        disabled={!enabled}
        className={[
          // Cinema-like seat: compact square with clear states
          'inline-flex items-center justify-center rounded-md border transition-colors select-none',
          'focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent',
          getSeatSizeClass(table.size),
          selected ? 'border-brand-dark bg-brand/10 text-brand-dark' : '',
          !selected && enabled ? 'border-neutral-300 bg-white hover:border-brand-dark hover:bg-brand/5' : '',
          !enabled ? 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-70' : '',
          'text-[11px] md:text-xs font-semibold tabular-nums',
          p.className || '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-pressed={selected}
        aria-label={`Pilih tempat ${table.label}. Kapasitas minimal ${table.minCapacity}, maksimal ${table.maxCapacity}${reason ? `. ${reason}.` : '.'}`}
      >
        {table.label}
      </button>
    );
  };

  const SectionCard = (p: { title: string; hint?: string; children: React.ReactNode }) => (
    <div className="border border-neutral-200/80 rounded-lg bg-white p-3 md:p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h4 className="text-sm font-semibold text-neutral-900">{p.title}</h4>
        {!!p.hint && <span className="text-xs text-neutral-500">{p.hint}</span>}
      </div>
      {p.children}
    </div>
  );

  const selectedTable = value ? reservationTablesById[value] : null;
  const selectedReason = selectedTable ? getDisabledReason(selectedTable) : null;

  return (
    <div className="space-y-4">
      <SectionCard title="Denah" hint={!hasPeople ? 'Isi jumlah orang untuk filter tempat' : undefined}>
            {/* Denah image */}
            <div className="border border-neutral-200 bg-white rounded-lg p-3">
            <div className="text-xs font-semibold text-neutral-800 mb-2">Peta tempat duduk</div>
            <div className="relative w-1/2 mx-auto overflow-hidden rounded-lg bg-neutral-50 border border-neutral-200">
              <Image
                src="/images/denah.png"
                alt="Denah tempat duduk"
                width={1400}
                height={900}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        {/* Legend + Selected info */}
        <div className="space-y-3 my-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 rounded-sm border border-neutral-300 bg-white" />
              Tersedia
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 rounded-sm border border-brand-dark bg-brand/10" />
              Dipilih
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 rounded-sm border border-neutral-200 bg-neutral-100" />
              Disabled
            </span>
          </div>
          <div className="text-xs text-neutral-700 border border-neutral-200 bg-white rounded-lg px-3 py-2">
            {selectedTable ? (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-semibold">{selectedTable.label}</span>
                <span className="text-neutral-500">({formatCapacity(selectedTable)})</span>
                {selectedReason && <span className="text-neutral-500">• {selectedReason}</span>}
              </div>
            ) : (
              <span className="text-neutral-500">Belum pilih tempat</span>
            )}
          </div>
        </div>


        </div>
        {/* Lantai dasar */}
        <div className="space-y-3">
          <div className="border border-neutral-200 rounded-lg p-3 bg-neutral-50">
            <div className="text-[11px] font-semibold text-neutral-700 mb-2">Lantai Dasar</div>

            <div className="space-y-3">
              {/* Indoor (A1-A3) */}
              <div className="border border-neutral-200 rounded-lg p-3 bg-white">
                <div className="text-[11px] font-medium text-neutral-600 mb-2">Indoor</div>
                <div className="flex flex-wrap gap-2">
                  <TableButton tableId="A1" />
                  <TableButton tableId="A2" />
                  <TableButton tableId="A3" />
                </div>
              </div>

              {/* Tengah: kiri (E), dapur (D1), kanan (B) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                {/* Kiri (E) */}
                <div className="border border-neutral-200 rounded-lg p-3 bg-white">
                  <div className="text-[11px] font-medium text-neutral-600 mb-2">Semi Outdoor</div>
                  <div className="flex flex-wrap gap-2">
                    <TableButton tableId="E1" />
                    <TableButton tableId="E2" />
                    <TableButton tableId="E3" />
                    <TableButton tableId="E4" />
                  </div>
                </div>

                {/* Tengah (D1) */}
                <div className="border border-neutral-200 rounded-lg p-3 bg-white">
                  <div className="text-[11px] font-medium text-neutral-600 mb-2">Semi Outdoor</div>
                  <div className="mb-2 rounded-md border border-dashed border-neutral-200 bg-neutral-50 px-3 py-2 text-center text-[11px] font-semibold text-neutral-500">
                    DAPUR
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <TableButton tableId="D1" />
                  </div>
                </div>

                {/* Kanan (B) */}
                <div className="border border-neutral-200 rounded-lg p-3 bg-white">
                  <div className="text-[11px] font-medium text-neutral-600 mb-2">Semi Outdoor</div>
                  <div className="flex flex-wrap gap-2">
                    <TableButton tableId="B1" />
                    <TableButton tableId="B2" />
                    <TableButton tableId="B3" />
                  </div>
                </div>
              </div>

              {/* Belakang (C1) */}
              <div className="border border-neutral-200 rounded-lg p-3 bg-white">
                <div className="text-[11px] font-medium text-neutral-600 mb-2">Semi Outdoor</div>
                <div className="flex flex-wrap gap-2">
                  <TableButton tableId="C1" />
                </div>
              </div>
            </div>
          </div>

          {/* Lantai atas */}
          <div className="border border-neutral-200 rounded-lg p-3 bg-neutral-50">
            <div className="text-[11px] font-semibold text-neutral-700 mb-2">Lantai Atas</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Atas 1 (F) */}
              <div className="border border-neutral-200 rounded-lg p-3 bg-white">
                <div className="text-[11px] font-medium text-neutral-600 mb-2">Atas 1</div>
                <div className="flex flex-wrap gap-2">
                  <TableButton tableId="F1" />
                  <TableButton tableId="F2" />
                  <TableButton tableId="F3" />
                  <TableButton tableId="F4" />
                  <TableButton tableId="F5" />
                  <TableButton tableId="F6" />
                </div>
              </div>

              {/* Atas 2 (G) */}
              <div className="border border-neutral-200 rounded-lg p-3 bg-white">
                <div className="text-[11px] font-medium text-neutral-600 mb-2">Atas 2</div>
                <div className="flex flex-wrap gap-2">
                  <TableButton tableId="G1" />
                  <TableButton tableId="G2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>


    </div>
  );
}


