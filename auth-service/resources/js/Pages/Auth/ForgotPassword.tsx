import { useForm, Head } from '@inertiajs/react';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import AuthenticationCard from '@/Components/AuthenticationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  status: string;
}

export default function ForgotPassword({ status }: Props) {
  const route = useRoute();
  const form = useForm({
    email: '',
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('password.email'));
  }

  return (
    <AuthenticationCard>
      <Head title="Forgot Password" />

      <div className="mb-4 text-sm text-muted-foreground">
        Forgot your password? No problem. Just let us know your email address
        and we will email you a password reset link that will allow you to
        choose a new one.
      </div>

      {status && (
        <div className="mb-4 font-medium text-sm text-green-600">
          {status}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.data.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('email', e.currentTarget.value)}
            required
            autoFocus
          />
          {form.errors.email && (
            <p className="text-sm font-medium text-destructive">{form.errors.email}</p>
          )}
        </div>

        <div className="flex items-center justify-end">
          <Button
            type="submit"
            disabled={form.processing}
          >
            Email Password Reset Link
          </Button>
        </div>
      </form>
    </AuthenticationCard>
  );
}
