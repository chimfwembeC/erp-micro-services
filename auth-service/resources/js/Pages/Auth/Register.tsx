import { Link, useForm, Head } from '@inertiajs/react';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import AuthenticationCard from '@/Components/AuthenticationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function Register() {
  const page = useTypedPage();
  const route = useRoute();
  const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('register'), {
      onFinish: () => form.reset('password', 'password_confirmation'),
    });
  }

  return (
    <AuthenticationCard>
      <Head title="Register" />

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={form.data.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('name', e.currentTarget.value)}
            required
            autoFocus
            autoComplete="name"
          />
          {form.errors.name && (
            <p className="text-sm font-medium text-destructive">{form.errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.data.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('email', e.currentTarget.value)}
            required
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

        {page.props.jetstream.hasTermsAndPrivacyPolicyFeature && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="terms"
                checked={form.data.terms}
                onCheckedChange={(checked: boolean) => form.setData('terms', checked)}
                required
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{' '}
                <a
                  target="_blank"
                  href={route('terms.show')}
                  className="text-primary hover:underline"
                >
                  Terms of Service
                </a>
                {' '}and{' '}
                <a
                  target="_blank"
                  href={route('policy.show')}
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </a>
              </Label>
            </div>
            {form.errors.terms && (
              <p className="text-sm font-medium text-destructive">{form.errors.terms}</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-end space-x-4">
          <Link
            href={route('login')}
            className="text-sm text-primary hover:underline"
          >
            Already registered?
          </Link>

          <Button
            type="submit"
            disabled={form.processing}
          >
            Register
          </Button>
        </div>
      </form>
    </AuthenticationCard>
  );
}
