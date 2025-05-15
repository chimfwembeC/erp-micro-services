import React, { forwardRef } from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, defaultChecked, onChange, onCheckedChange, ...props }, ref) => {
    // Handle both onChange and onCheckedChange
    const handleChange = (checked: boolean) => {
      if (onCheckedChange) {
        onCheckedChange(checked);
      }
      if (onChange) {
        const event = {
          target: { checked },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    return (
      <Switch
        ref={ref}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={handleChange}
        className={cn(className)}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
