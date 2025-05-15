import { useForm, Head } from '@inertiajs/react';
import React, { useRef, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import AuthenticationCard from '@/Components/AuthenticationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export default function TwoFactorChallenge() {
  const route = useRoute();
  const [recovery, setRecovery] = useState(false);
  const form = useForm({
    code: '',
    recovery_code: '',
  });
  const recoveryCodeRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  function toggleRecovery(e: React.FormEvent) {
    e.preventDefault();
    const isRecovery = !recovery;
    setRecovery(isRecovery);

    setTimeout(() => {
      if (isRecovery) {
        recoveryCodeRef.current?.focus();
        form.setData('code', '');
      } else {
        codeRef.current?.focus();
        form.setData('recovery_code', '');
      }
    }, 100);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('two-factor.login'));
  }

  return (
    <AuthenticationCard>
      <Head title="Two-Factor Confirmation" />

      <div className="mb-4 text-sm text-muted-foreground">
        {recovery
          ? 'Please confirm access to your account by entering one of your emergency recovery codes.'
          : 'Please confirm access to your account by entering the authentication code provided by your authenticator application.'}
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {recovery ? (
          <div className="space-y-2">
            <Label htmlFor="recovery_code">Recovery Code</Label>
            <Input
              id="recovery_code"
              type="text"
              value={form.data.recovery_code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                form.setData('recovery_code', e.currentTarget.value)
              }
              ref={recoveryCodeRef}
              autoComplete="one-time-code"
            />
            {form.errors.recovery_code && (
              <p className="text-sm font-medium text-destructive">{form.errors.recovery_code}</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="code">Authentication Code</Label>
            <InputOTP
              maxLength={6}
              value={form.data.code}
              onChange={(value) => form.setData('code', value)}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} />
                  ))}
                </InputOTPGroup>
              )}
            />
            {form.errors.code && (
              <p className="text-sm font-medium text-destructive">{form.errors.code}</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="link"
            className="text-sm text-primary"
            onClick={toggleRecovery}
          >
            {recovery ? 'Use an authentication code' : 'Use a recovery code'}
          </Button>

          <Button
            type="submit"
            disabled={form.processing}
          >
            Log in
          </Button>
        </div>
      </form>
    </AuthenticationCard>
  );
}
