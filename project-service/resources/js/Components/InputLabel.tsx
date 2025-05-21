import React, { PropsWithChildren } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Props {
  value?: string;
  htmlFor?: string;
  className?: string;
}

export default function InputLabel({
  value,
  htmlFor,
  className,
  children,
}: PropsWithChildren<Props>) {
  return (
    <Label
      className={cn(className)}
      htmlFor={htmlFor}
    >
      {value || children}
    </Label>
  );
}
