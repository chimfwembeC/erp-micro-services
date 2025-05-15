import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  UserPlus,
  MessageSquare,
  BarChart3,
  Mail,
  Calendar,
  FileText,
  Settings,
  ArrowRight,
  CheckCircle2,
  Building2,
  Briefcase,
  Phone,
  Globe
} from 'lucide-react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import LanguageSwitcher from '@/Components/LanguageSwitcher';

interface Props {
  canLogin: boolean;
  canRegister: boolean;
  laravelVersion: string;
  phpVersion: string;
}

export default function Welcome({
  canLogin,
  canRegister,
  laravelVersion,
  phpVersion,
}: Props) {
  const route = useRoute();
  const page = useTypedPage();
  const { t } = useTranslation();

  return (
    <>
      <Head title={t('welcome.title')} />
      <div className="relative min-h-screen bg-background">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">{t('welcome.title')}</span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              {page.props.auth.user ? (
                <Button asChild>
                  <Link href={route('dashboard')}>
                    {t('welcome.dashboard')}
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">
                      {t('welcome.login')}
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">
                      {t('welcome.register')}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto pt-32 pb-20">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {t('welcome.title')}
              </h1>
              <p className="mt-2 text-xl text-muted-foreground">
                {t('welcome.subtitle')}
              </p>
              <p className="mt-4 text-muted-foreground max-w-[600px]">
                {t('welcome.description')}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {page.props.auth.user ? (
                  <Button size="lg" asChild>
                    <Link href={route('dashboard')}>
                      {t('welcome.dashboard')}
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild>
                      <Link href="/register">
                        {t('welcome.getStarted')}
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="#features">
                        {t('welcome.features')}
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="/crm-hero.svg"
                alt="CRM Illustration"
                className="w-full h-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto py-20 bg-muted/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t('welcome.features')}
            </h2>
            <p className="mt-4 text-muted-foreground max-w-[600px] mx-auto">
              {t('welcome.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{t('features.clientManagement.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('features.clientManagement.description')}</p>
              </CardContent>
              <CardFooter>
                <Badge variant="outline" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> {t('common.poweredBy')}
                </Badge>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <UserPlus className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{t('features.leadTracking.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('features.leadTracking.description')}</p>
              </CardContent>
              <CardFooter>
                <Badge variant="outline" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> {t('common.poweredBy')}
                </Badge>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{t('features.communication.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('features.communication.description')}</p>
              </CardContent>
              <CardFooter>
                <Badge variant="outline" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> {t('common.poweredBy')}
                </Badge>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <Phone className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{t('features.liveChat.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('features.liveChat.description')}</p>
              </CardContent>
              <CardFooter>
                <Badge variant="outline" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> {t('common.poweredBy')}
                </Badge>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{t('features.reporting.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('features.reporting.description')}</p>
              </CardContent>
              <CardFooter>
                <Badge variant="outline" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> {t('common.poweredBy')}
                </Badge>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{t('features.integration.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('features.integration.description')}</p>
              </CardContent>
              <CardFooter>
                <Badge variant="outline" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> {t('common.poweredBy')}
                </Badge>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto py-20">
          <div className="rounded-lg bg-primary p-8 md:p-12 shadow-lg">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                  {t('welcome.getStarted')}
                </h2>
                <p className="mt-4 text-primary-foreground/90 max-w-[600px]">
                  {t('welcome.description')}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  {page.props.auth.user ? (
                    <Button size="lg" variant="secondary" asChild>
                      <Link href={route('dashboard')}>
                        {t('welcome.dashboard')}
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button size="lg" variant="secondary" asChild>
                        <Link href="/register">
                          {t('welcome.register')}
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                        <Link href="/login">
                          {t('welcome.login')}
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="hidden lg:flex justify-end">
                <Briefcase className="h-32 w-32 text-primary-foreground/80" />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-muted/50">
          <div className="container mx-auto py-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">{t('welcome.title')}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t('welcome.subtitle')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('welcome.features')}</h3>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>{t('features.clientManagement.title')}</li>
                  <li>{t('features.leadTracking.title')}</li>
                  <li>{t('features.communication.title')}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('common.learnMore')}</h3>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>{t('common.viewDemo')}</li>
                  <li>{t('common.contactUs')}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('common.poweredBy')}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  TekRem ERP Ecosystem
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t('common.version')} 1.0.0
                </p>
              </div>
            </div>
            <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} TekRem. {t('common.poweredBy')} TekRem.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
