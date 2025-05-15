import React, { useState } from 'react';
import useTypedPage from '@/Hooks/useTypedPage';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Banner() {
  const [show, setShow] = useState(true);
  const { props } = useTypedPage();
  const style = props.jetstream.flash?.bannerStyle || 'success';
  const message = props.jetstream.flash?.banner || '';

  if (!show || !message) {
    return null;
  }

  return (
    <Alert
      variant={style === 'success' ? 'default' : 'destructive'}
      className={cn(
        'relative border-none rounded-none',
        style === 'success' ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'
      )}
    >
      <div className="container flex items-center justify-between py-1">
        <div className="flex items-center gap-2">
          {style === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <AlertDescription className="font-medium text-sm">
            {message}
          </AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-primary-foreground/10"
          onClick={() => setShow(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </Alert>
  );
}
