/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TableColumnsDropdown from './table-columns-dropdown';

type Props = {
  table: any;
  searchField: string;
  setSearchField: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onAddClick?: () => void;
  onDeleteSelected?: (rows: any[]) => void;
  selectable?: boolean;
  searchFields?: { value: string; label: string }[];
  isAdmin?: boolean; // For role-based access control
};

export default function DataTableToolbar({
  table,
  searchField,
  setSearchField,
  searchQuery,
  setSearchQuery,
  onAddClick,
  onDeleteSelected,
  selectable = false,
  searchFields,
  isAdmin = false,
}: Props) {
  const selectedCount = table.getSelectedRowModel().flatRows.length;

  // Default search fields for user data
  const defaultSearchFields = [
    { value: 'firstName', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'id', label: 'ID' },
    { value: 'phone', label: 'Phone' },
    { value: 'birthDate', label: 'Date of Birth' },
  ];

  const fields = searchFields || defaultSearchFields;
  const currentField = fields.find(f => f.value === searchField);
  const displayLabel = currentField?.label || searchField;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <Input
        placeholder={`Search by ${displayLabel}...`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-xs"
      />

      <Select value={searchField} onValueChange={(v) => setSearchField(v as any)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fields.map(field => (
            <SelectItem key={field.value} value={field.value}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-2">
        <TableColumnsDropdown table={table} />

        {/* Only show delete button for admins */}
        {isAdmin && selectable && selectedCount > 0 && onDeleteSelected && (
          <Button
            variant="destructive"
            onClick={() => {
              if (!confirm(`Delete ${selectedCount} selected row(s)?`)) return;
              const rows = table.getSelectedRowModel().flatRows.map((r: any) => r.original);
              onDeleteSelected(rows);
              // clear selection via table API
              table.resetRowSelection();
            }}
          >
            Delete selected ({selectedCount})
          </Button>
        )}

        {/* Only show Add button for admins */}
        {isAdmin && onAddClick && <Button onClick={onAddClick}>Add Data</Button>}
      </div>
    </div>
  );
}
