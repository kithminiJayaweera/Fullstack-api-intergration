/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import DataTableToolbar from './data-table-toolbar';

import { UserForm } from '@/components/forms/UserForm';

import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  VisibilityState,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { createSelectionColumn } from './selection-column';
import DataTableFooter from './data-table-footer';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaginationInfo } from '@/api/user.api';
// pagination is provided by DataTableFooter

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onAddData?: (newData: any) => void;
  onDeleteSelected?: (rows: TData[]) => void;
  /** enable row selection; selection column is added automatically */
  selectable?: boolean;
  /** called whenever selection state changes; receives the raw rowSelection object */
  onSelectionChange?: (selection: RowSelectionState) => void;
  /** custom search fields for the toolbar dropdown */
  searchFields?: { value: string; label: string }[];
  /** initial search field */
  defaultSearchField?: string;
  /** Backend pagination info - when provided, disables frontend pagination */
  pagination?: PaginationInfo;
  /** Callback when page changes (for backend pagination) */
  onPageChange?: (page: number) => void;
  /** Callback when page size changes (for backend pagination) */
  onPageSizeChange?: (size: number) => void;
  /** Whether current user is admin (for role-based UI) */
  isAdmin?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onAddData,
  onDeleteSelected,
  selectable = false,
  onSelectionChange,
  searchFields,
  defaultSearchField = 'id',
  pagination,
  onPageChange,
  onPageSizeChange,
  isAdmin = false,
}: DataTableProps<TData, TValue>) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [searchField, setSearchField] = React.useState<string>(defaultSearchField);
  const [searchQuery, setSearchQuery] = React.useState('');

  // If using backend pagination, don't filter on frontend
  const filteredData = React.useMemo(() => {
    if (pagination) return data; // Backend pagination - data is already filtered
    
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((row: any) => {
      const value = String(row[searchField] ?? '').toLowerCase();
      // special handling for firstName to include lastName
      if (searchField === 'firstName') {
        const full = `${row.firstName ?? ''} ${row.lastName ?? ''}`.toLowerCase();
        return full.includes(q) || value.includes(q);
      }
      return value.includes(q);
    });
  }, [data, searchField, searchQuery, pagination]);

  const tableColumns = React.useMemo(() => {
    if (selectable) {
      const sel = createSelectionColumn<TData>();
      if (Array.isArray(columns) && columns[0]?.id !== sel.id) {
        return [sel as ColumnDef<TData, TValue>, ...columns];
      }
    }
    return columns;
  }, [columns, selectable]);

  const table = useReactTable({
    data: filteredData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      // updater can be an object or a function
      setRowSelection((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        if (onSelectionChange) onSelectionChange(next as RowSelectionState);
        return next as RowSelectionState;
      });
    },

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="mb-4">
        {/* Toolbar component - keeps DataTable file smaller and reusable */}
        <DataTableToolbar
          table={table}
          searchField={searchField}
          setSearchField={(v: string) => setSearchField(v)}
          searchQuery={searchQuery}
          setSearchQuery={(v: string) => setSearchQuery(v)}
          onAddClick={onAddData ? () => setAddOpen(true) : undefined}
          onDeleteSelected={onDeleteSelected}
          selectable={selectable}
          searchFields={searchFields}
          isAdmin={isAdmin}
        />
        {onAddData && (
          <UserForm
            open={addOpen}
            onOpenChange={setAddOpen}
            onSubmit={async (data) => {
              if (onAddData) {
                // delegate to page-level handler
                await onAddData(data);
              }
            }}
          />
        )}
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getVisibleFlatColumns().length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTableFooter 
        table={table} 
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}

export default DataTable;
