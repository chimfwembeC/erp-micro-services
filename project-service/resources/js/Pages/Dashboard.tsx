import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useTranslation } from 'react-i18next';

export default function Dashboard({ auth }: PageProps) {
  const user = auth.user;
  const { t } = useTranslation();

  return (
    <AppLayout
      title={t('common.dashboard')}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {t('common.dashboard')}
        </h2>
      )}
    >
      <Head title={t('common.dashboard')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">{t('dashboard.welcome', { name: user?.name })}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">{t('projects.title')}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{t('dashboard.view_projects')}</p>
                <a href={route('projects.index')} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {t('common.view')} →
                </a>
              </div>

              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">{t('tasks.my_tasks')}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{t('dashboard.view_my_tasks')}</p>
                <a href={route('tasks.my-tasks')} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {t('common.view')} →
                </a>
              </div>

              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">{t('time_logs.title')}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{t('dashboard.view_time_logs')}</p>
                <a href={route('time-logs.my-logs')} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {t('common.view')} →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}



