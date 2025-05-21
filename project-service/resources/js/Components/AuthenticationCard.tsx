import React, { PropsWithChildren } from 'react';
import AuthenticationCardLogo from '@/Components/AuthenticationCardLogo';
import { Card, CardContent } from '@/components/ui/card';

export default function AuthenticationCard({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background">
      <div>
        <AuthenticationCardLogo />
      </div>

      <Card className="w-full sm:max-w-md mt-6">
        <CardContent className="pt-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
