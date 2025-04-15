import type { JSX } from 'preact';

interface InputProps {
  readonly type?: string;
  readonly placeholder?: string;
  readonly value: string;
  readonly onChange: (e: JSX.TargetedEvent<HTMLInputElement>) => void;
  readonly name?: string;
  readonly id?: string;
  readonly required?: boolean;
  readonly className?: string;
  readonly label?: string;
}

export default function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  name,
  id,
  required = false,
  className = '',
  label,
}: Readonly<InputProps>) {
  const inputId = id ?? name;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={inputId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${className}`}
      />
    </div>
  );
}