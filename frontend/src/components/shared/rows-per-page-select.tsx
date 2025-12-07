import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  options?: number[];
  className?: string;
};

export default function RowsPerPageSelect({
  value,
  onValueChange,
  options = [10, 20, 30, 40, 50],
  className,
}: Props) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={value} />
      </SelectTrigger>
      <SelectContent side="top">
        {options.map((pageSize) => (
          <SelectItem key={pageSize} value={`${pageSize}`}>
            {pageSize}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
