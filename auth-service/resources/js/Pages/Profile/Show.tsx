import React from 'react';
import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm';
import LogoutOtherBrowserSessions from '@/Pages/Profile/Partials/LogoutOtherBrowserSessionsForm';
import TwoFactorAuthenticationForm from '@/Pages/Profile/Partials/TwoFactorAuthenticationForm';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';
import useTypedPage from '@/Hooks/useTypedPage';
import SectionBorder from '@/Components/SectionBorder';
import AppLayout from '@/Layouts/AppLayout';
import { Session } from '@/types';
import LanguagePreference from '@/Components/Profile/LanguagePreference';
import { useTranslation } from 'react-i18next';

interface Props {
  sessions: Session[];
  confirmsTwoFactorAuthentication: boolean;
}

export default function Show({
  sessions,
  confirmsTwoFactorAuthentication,
}: Props) {
  const page = useTypedPage();
  const { t } = useTranslation();

  return (
    <AppLayout
      title={t('common.profile')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('common.profile')}
        </h2>
      )}
    >
      <div>
        <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
          {page.props.jetstream.canUpdateProfileInformation ? (
            <div>
              <UpdateProfileInformationForm user={page.props.auth.user!} />

              <SectionBorder />
            </div>
          ) : null}

          {page.props.jetstream.canUpdatePassword ? (
            <div className="mt-10 sm:mt-0">
              <UpdatePasswordForm />

              <SectionBorder />
            </div>
          ) : null}

          {page.props.jetstream.canManageTwoFactorAuthentication ? (
            <div className="mt-10 sm:mt-0">
              <TwoFactorAuthenticationForm
                requiresConfirmation={confirmsTwoFactorAuthentication}
              />

              <SectionBorder />
            </div>
          ) : null}

          <div className="mt-10 sm:mt-0">
            <LanguagePreference user={page.props.auth.user!} />
          </div>

          <SectionBorder />

          <div className="mt-10 sm:mt-0">
            <LogoutOtherBrowserSessions sessions={sessions} />
          </div>

          {page.props.jetstream.hasAccountDeletionFeatures ? (
            <>
              <SectionBorder />

              <div className="mt-10 sm:mt-0">
                <DeleteUserForm />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
}
