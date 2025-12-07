import { ColumnDef } from '@tanstack/react-table';
import Checkbox from '@/components/ui/checkbox';

/**
 * Returns a selection column for tanstack table that renders a header
 * checkbox (toggle all visible) and a per-row checkbox.
 */
export function createSelectionColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center">
        <Checkbox
          aria-label="Select all"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Checkbox
          aria-label={`Select row ${row.id}`}
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      </div>
    ),
    enableSorting: false,
    enableColumnFilter: false,
    size: 24,
  };
}

export default createSelectionColumn;
