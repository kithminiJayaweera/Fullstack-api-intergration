import * as React from 'react';
import { z, ZodType } from 'zod';
import { Input } from './input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  /** Optional custom Zod schema to validate the full phone string (including country code) */
  schema?: ZodType<string>;
  /** If provided, will be called with the validation result: (isValid, errorMessage?) */
  onValidation?: (isValid: boolean, errorMessage?: string) => void;
  /** External error message from parent (e.g. form-level errors). If present, it overrides local validation message. */
  error?: string | null;
}

const countryCodes = [
  { code: '+94', country: 'LK', flag: '🇱🇰' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
];

export function PhoneInput({ value = '', onChange, placeholder = 'Enter phone number', className, name, schema, onValidation }: PhoneInputProps) {
  const [countryCode, setCountryCode] = React.useState('+94');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (value) {
      const foundCode = countryCodes.find(c => value.startsWith(c.code));
      if (foundCode) {
        setCountryCode(foundCode.code);
        setPhoneNumber(value.substring(foundCode.code.length).trim());
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value]);

  const handlePhoneChange = (newPhone: string) => {
    setPhoneNumber(newPhone);
    // clear validation error while user types
    if (error) setError(null);
    const fullNumber = `${countryCode} ${newPhone}`.trim();
    onChange?.(fullNumber);
  };

  const handleCountryCodeChange = (newCode: string) => {
    setCountryCode(newCode);
    // clear validation error when country changes
    if (error) setError(null);
    const fullNumber = `${newCode} ${phoneNumber}`.trim();
    onChange?.(fullNumber);
  };

  // default simple phone schema: require at least 7 characters and allow common separators
  const defaultPhoneSchema = z
    .string()
    .min(7, { message: 'Phone number is too short' })
    .regex(/^[0-9+()\-\s]+$/, { message: 'Phone number contains invalid characters' });

  const validate = (schemaToUse?: ZodType<string>) => {
    const full = `${countryCode} ${phoneNumber}`.trim();
    const s = schemaToUse ?? defaultPhoneSchema;
    const result = s.safeParse(full);
    if (!result.success) {
      const msg = result.error.issues?.[0]?.message ?? 'Invalid phone number';
      setError(msg);
      return { valid: false, message: msg } as const;
    }
    setError(null);
    return { valid: true } as const;
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Select value={countryCode} onValueChange={handleCountryCodeChange}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent >
          {countryCodes.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.code}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex-1">
        <Input
          name={name}
          type="tel"
          value={phoneNumber}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onBlur={() => {
            const res = validate(schema);
            onValidation?.(res.valid, 'message' in res ? res.message : undefined);
          }}
          placeholder={placeholder}
        />
      </div>
      <input type="hidden" name={name} value={`${countryCode} ${phoneNumber}`.trim()} />
    </div>
  );
}