import * as React from 'react';
import { DatePicker } from './date-picker';
import { Input } from './input';
import { calculateAgeFromBirthDate } from '@/lib/date';

interface BirthDateAgePickerProps {
  birthDate?: Date;
  onBirthDateChange?: (date: Date | undefined) => void;
  onAgeChange?: (age: number | undefined) => void;
  birthDateError?: string;
  ageError?: string;
  className?: string;
}

export function BirthDateAgePicker({
  birthDate,
  onBirthDateChange,
  onAgeChange,
  birthDateError,
  ageError,
  className,
}: BirthDateAgePickerProps) {
  const [age, setAge] = React.useState<number>();

  const handleBirthDateChange = (date: Date | undefined) => {
    onBirthDateChange?.(date);
    if (date) {
      const calculatedAge = calculateAgeFromBirthDate(date);
      setAge(calculatedAge);
      onAgeChange?.(calculatedAge);
    } else {
      setAge(undefined);
      onAgeChange?.(undefined);
    }
  };

  return (
    <div className={className}>
      <div>
        <label className="mb-1 block text-sm font-medium">Birth Date</label>
        <DatePicker
          date={birthDate}
          onDateChange={handleBirthDateChange}
          placeholder="Select birth date"
          className={birthDateError ? 'border-red-500' : ''}
        />
        {birthDateError && (
          <p className="mt-1 text-sm text-red-500">{birthDateError}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Age</label>
        <Input
          type="number"
          value={age || ''}
          placeholder="Age will be calculated"
          readOnly
          className={`bg-gray-50 ${ageError ? 'border-red-500' : ''}`}
        />
        {ageError && <p className="mt-1 text-sm text-red-500">{ageError}</p>}
      </div>
    </div>
  );
}
