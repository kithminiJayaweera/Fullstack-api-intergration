/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTablePagination } from '@/components/shared/pagination';
import RowsPerPageSelect from '@/components/shared/rows-per-page-select';
import { PaginationInfo } from '@/api/user.api';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  table: any;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
};

export default function DataTableFooter({ table, pagination, onPageChange, onPageSizeChange }: Props) {
  // Backend pagination mode
  if (pagination && onPageChange && onPageSizeChange) {
    return (
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <RowsPerPageSelect
            value={`${pagination.pageSize}`}
            onValueChange={(value) => onPageSizeChange(Number(value))}
            className="h-8 w-[70px]"
          />
        </div>
        <div className="flex items-center space-x-6">
          <p className="text-sm text-gray-600">
            Page {pagination.pageNumber} of {pagination.totalPages} ({pagination.total} total)
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.pageNumber - 1)}
              disabled={pagination.pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.pageNumber + 1)}
              disabled={pagination.pageNumber >= pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Frontend pagination mode (default)
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <RowsPerPageSelect
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
          className="h-8 w-[70px]"
        />
      </div>
      <div className="flex justify-end">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
