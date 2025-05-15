import { useForm, Head } from '@inertiajs/react';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import AuthenticationCard from '@/Components/AuthenticationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  token: string;
  email: string;
}

export default function ResetPassword({ token, email }: Props) {
  const route = useRoute();
  const form = useForm({
    token,
    email,
    password: '',
    password_confirmation: '',
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('password.update'), {
      onFinish: () => form.reset('password', 'password_confirmation'),
    });
  }

  return (
    <AuthenticationCard>
      <Head title="Reset Password" />

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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={form.data.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('password', e.currentTarget.value)}
            required
            autoComplete="new-password"
          />
          {form.errors.password && (
            <p className="text-sm font-medium text-destructive">{form.errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password_confirmation">Confirm Password</Label>
          <Input
            id="password_confirmation"
            type="password"
            value={form.data.password_confirmation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              form.setData('password_confirmation', e.currentTarget.value)
            }
            required
            autoComplete="new-password"
          />
          {form.errors.password_confirmation && (
            <p className="text-sm font-medium text-destructive">{form.errors.password_confirmation}</p>
          )}
        </div>

        <div className="flex items-center justify-end">
          <Button
            type="submit"
            disabled={form.processing}
          >
            Reset Password
          </Button>
        </div>
      </form>
    </AuthenticationCard>
  );
}
