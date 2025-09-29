import { useState } from 'react';

type BaseProps = {
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'date';
  label?: string;
  name?: string;
  disabled?: boolean;
};

type ControlledProps = {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: never;
};

type UncontrolledProps = {
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: never;
};

type FormDataProps = BaseProps & (ControlledProps | UncontrolledProps);

export const InputForm = (props: FormDataProps) => {
  const { placeholder, type = 'text', label, name, disabled } = props;

  const inputProps =
    'value' in props
      ? { value: props.value ?? '', onChange: props.onChange }
      : { defaultValue: props.defaultValue, onChange: props.onChange };

  return (
    <div>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        disabled={disabled}
        {...inputProps}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:text-gray-600"
        placeholder={placeholder}
      />
    </div>
  );
};

export const InputPasswordForm = (props: FormDataProps) => {
  const { placeholder, label, name, disabled } = props;
  const [show, setShow] = useState(false);

  const inputProps =
    'value' in props
      ? { value: props.value ?? '', onChange: props.onChange }
      : { defaultValue: props.defaultValue, onChange: props.onChange };

  return (
    <div>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          id={name}
          name={name}
          disabled={disabled}
          {...inputProps}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:text-gray-600"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 disabled:text-gray-400"
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          disabled={disabled}
          tabIndex={-1}
        >
          {!show ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.5 12S5.25 5.25 11.25 5.25c1.46 0 2.842.32 4.07.89" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.02 15.777A10.477 10.477 0 0021.75 12S18 18.75 12 18.75c-1.712 0-3.3-.42-4.708-1.126" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 9.88a3 3 0 004.24 4.24" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.125 4.5 12 4.5c4.875 0 8.577 3.01 9.964 7.178.07.204.07.44 0 .644C20.577 16.49 16.875 19.5 12 19.5c-4.875 0-8.577-3.01-9.964-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
