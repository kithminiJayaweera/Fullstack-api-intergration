import { productColumns } from '@/components/data-table/product-columns';
import { DataTable } from '@/components/data-table/data-table';
import TableSkeleton from '@/components/shared/TableSkeleton';
import { useProducts } from '@/features/products/hooks/useProductQueries';

export default function ProductsTable() {
  const { data: products, isLoading } = useProducts();

  const productSearchFields = [
    { value: 'title', label: 'Title' },
    { value: 'brand', label: 'Brand' },
    { value: 'category', label: 'Category' },
    { value: 'id', label: 'ID' },
  ];

  if (isLoading) {
    return <TableSkeleton rows={10} columns={9} showImage={true} />;
  }

  return (
    <div className="mb-8">
      <DataTable
        columns={productColumns}
        data={products ?? []}
        searchFields={productSearchFields}
        defaultSearchField="title"
      />
    </div>
  );
}