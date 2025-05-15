import React, { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  message?: string;
  className?: string;
}

export default function InputError({
  message,
  className,
  children,
}: PropsWithChildren<Props>) {
  if (!message && !children) {
    return null;
  }
  return (
    <div className={cn(className)}>
      <p className="text-sm font-medium text-destructive">
        {message || children}
      </p>
    </div>
  );
}
