import { Link, useForm, Head } from '@inertiajs/react';
import React, { useEffect } from 'react';
import useRoute from '@/Hooks/useRoute';
import AuthenticationCard from '@/Components/AuthenticationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';

interface Props {
  canResetPassword: boolean;
  status: string;
}

export default function Login({ canResetPassword, status }: Props) {
  const route = useRoute();
  const form = useForm({
    email: '',
    password: '',
    remember: '',
  });

  // Ensure CSRF token is available before submitting the form
  useEffect(() => {
    // Fetch CSRF cookie if needed
    axios.get('/sanctum/csrf-cookie').catch(error => {
      console.error('Error fetching CSRF cookie:', error);
    });
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Get the CSRF token from the meta tag
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    // Get the XSRF token from cookies
    const getCookie = (name: string): string | null => {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return match ? decodeURIComponent(match[3]) : null;
    };
    const xsrfToken = getCookie('XSRF-TOKEN');

    console.log('Submitting login form with:');
    console.log('- CSRF Token from meta:', token);
    console.log('- XSRF Token from cookie:', xsrfToken);

    // Use Inertia form submission
    form.post(route('login'), {
      onFinish: () => form.reset('password'),
      headers: {
        'X-CSRF-TOKEN': token || '',
        'X-XSRF-TOKEN': xsrfToken || '',
      },
    });
  }

  return (
    <AuthenticationCard>
      <Head title="Login" />

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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={form.data.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('password', e.currentTarget.value)}
            required
            autoComplete="current-password"
          />
          {form.errors.password && (
            <p className="text-sm font-medium text-destructive">{form.errors.password}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="remember"
            checked={form.data.remember === 'on'}
            onCheckedChange={(checked: boolean) =>
              form.setData('remember', checked ? 'on' : '')
            }
          />
          <Label htmlFor="remember" className="text-sm text-muted-foreground">
            Remember me
          </Label>
        </div>

        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          {canResetPassword && (
            <div>
              <Link
                href={route('password.request')}
                className="text-sm text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          )}

          <div className="flex items-center gap-4">
            <Link
              href={route('register')}
              className="text-sm text-primary hover:underline"
            >
              Need an account?
            </Link>

            <Button
              type="submit"
              disabled={form.processing}
            >
              Log in
            </Button>
          </div>
        </div>
      </form>
    </AuthenticationCard>
  );
}
