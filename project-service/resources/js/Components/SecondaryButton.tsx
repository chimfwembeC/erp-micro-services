import React, { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function SecondaryButton({
  children,
  className,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <Button
      variant="outline"
      {...props}
      className={cn(className)}
    >
      {children}
    </Button>
  );
}
