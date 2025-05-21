import { Link, useForm, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import useTranslate from '@/Hooks/useTranslate';
import AuthenticationCard from '@/Components/AuthenticationCard';
import PrimaryButton from '@/Components/PrimaryButton';

interface Props {
  status: string;
}

export default function VerifyEmail({ status }: Props) {
  const route = useRoute();
  const { t } = useTranslate();
  const form = useForm({});
  const verificationLinkSent = status === 'verification-link-sent';

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('verification.send'));
  }

  return (
    <AuthenticationCard>
      <Head title={t('auth.verifyEmail', 'Email Verification')} />

      <div className="mb-4 text-sm text-gray-600">
        {t('auth.verifyEmailInstructions', 'Before continuing, could you verify your email address by clicking on the link we just emailed to you? If you didn\'t receive the email, we will gladly send you another.')}
      </div>

      {verificationLinkSent && (
        <div className="mb-4 font-medium text-sm text-green-600">
          {t('profile.verificationLinkSent', 'A new verification link has been sent to the email address you provided during registration.')}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="mt-4 flex items-center justify-between">
          <PrimaryButton
            className={classNames({ 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            {t('auth.resendVerificationEmail', 'Resend Verification Email')}
          </PrimaryButton>

          <div>
            <Link
              href={route('profile.show')}
              className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t('dashboard.user.editProfile', 'Edit Profile')}
            </Link>
          </div>

          <Link
            href={route('logout')}
            method="post"
            as="button"
            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-2"
          >
            {t('common.logout', 'Log Out')}
          </Link>
        </div>
      </form>
    </AuthenticationCard>
  );
}
