import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const TextInput = forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>(({ className, ...props }, ref) => (
  <Input
    {...props}
    ref={ref}
    className={cn(className)}
  />
));

TextInput.displayName = 'TextInput';

export default TextInput;
