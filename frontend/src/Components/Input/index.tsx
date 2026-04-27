import React, { forwardRef, ChangeEvent, ReactNode } from 'react';

interface InputProps {
  wrapClassName?: string;
  className?: string;
  name?: string;
  placeholder?: string;
  type?: string;
  children?: ReactNode;
  errors?: string[];
  label?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  onChange?: (value: string) => void;
  shape?: string;
  size?: string;
  variant?: string;
  color?: string;
  [key: string]: unknown;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      wrapClassName = '',
      className = '',
      name = '',
      placeholder = '',
      type = 'text',
      children,
      errors = [],
      label = '',
      prefix,
      suffix,
      onChange,
      shape = '',
      size = '',
      variant = '',
      color = '',
      ...restProps
    },
    ref,
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e?.target?.value);
    };

    return (
      <>
        <div className={`${wrapClassName}`}>
          {!!label && label}
          {!!prefix && prefix}
          <input
            ref={ref}
            className={`${className} bg-transparent border-0`}
            type={type}
            name={name}
            onChange={handleChange}
            placeholder={placeholder}
            {...(restProps as React.InputHTMLAttributes<HTMLInputElement>)}
          />
          {!!suffix && suffix}
        </div>
      </>
    );
  },
);

Input.displayName = 'Input';

export { Input };
