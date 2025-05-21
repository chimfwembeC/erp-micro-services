import React, { PropsWithChildren, useState } from 'react';
import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import useTranslate from '@/Hooks/useTranslate';
import { Toaster } from '@/components/ui/sonner';
import { ModeToggle } from '@/Components/ModeToggle';
import { LanguageSwitcher } from '@/Components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface Props {
  title: string;
}

export default function GuestLayout({
  title,
  children,
}: PropsWithChildren<Props>) {
  const route = useRoute();
  const page = useTypedPage();
  const { t } = useTranslate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Head title={title} />
      <Toaster position="top-right" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href={route('welcome')} className="flex items-center space-x-2">
              <span className="font-bold text-xl">{t('common.tekremTech', 'TekRem')}</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href={route('welcome')}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t('navigation.home', 'Home')}
              </Link>
              <Link
                href={route('about')}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t('navigation.about', 'About')}
              </Link>
              <Link
                href={route('services')}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t('navigation.services', 'Services')}
              </Link>
              <Link
                href={route('portfolio')}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t('navigation.portfolio', 'Portfolio')}
              </Link>
              <Link
                href={route('team')}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t('navigation.team', 'Team')}
              </Link>
              <Link
                href={route('blog')}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t('navigation.blog', 'Blog')}
              </Link>
              <Link
                href={route('contact')}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t('navigation.contact', 'Contact')}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              {page.props.auth.user ? (
                <Link
                  href={route('dashboard')}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {t('common.dashboard', 'Dashboard')}
                </Link>
              ) : (
                <>
                  <Link
                    href={route('login')}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {t('auth.login', 'Log in')}
                  </Link>
                  <Link href={route('register')}>
                    <Button>{t('auth.register', 'Sign up')}</Button>
                  </Link>
                </>
              )}
            </div>
            <LanguageSwitcher />
            <ModeToggle />
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="container mx-auto py-4 space-y-4">
              <nav className="flex flex-col gap-4">
                <Link
                  href={route('welcome')}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('navigation.home', 'Home')}
                </Link>
                <Link
                  href={route('about')}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('navigation.about', 'About')}
                </Link>
                <Link
                  href={route('services')}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('navigation.services', 'Services')}
                </Link>
                <Link
                  href={route('portfolio')}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('navigation.portfolio', 'Portfolio')}
                </Link>
                <Link
                  href={route('team')}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('navigation.team', 'Team')}
                </Link>
                <Link
                  href={route('blog')}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('navigation.blog', 'Blog')}
                </Link>
                <Link
                  href={route('contact')}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('navigation.contact', 'Contact')}
                </Link>
              </nav>
              <div className="flex flex-col gap-4">
                {page.props.auth.user ? (
                  <Link
                    href={route('dashboard')}
                    className="text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('common.dashboard', 'Dashboard')}
                  </Link>
                ) : (
                  <>
                    <Link
                      href={route('login')}
                      className="text-sm font-medium transition-colors hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('auth.login', 'Log in')}
                    </Link>
                    <Link
                      href={route('register')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full">{t('auth.register', 'Sign up')}</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('common.tekremTech', 'TekRem')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('footer.description', 'Technology Remedies Innovations - Providing innovative software solutions for businesses in Zambia and beyond.')}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('footer.links', 'Links')}</h3>
              <nav className="flex flex-col gap-2">
                <Link href={route('welcome')} className="text-sm hover:underline">{t('navigation.home', 'Home')}</Link>
                <Link href={route('about')} className="text-sm hover:underline">{t('navigation.about', 'About')}</Link>
                <Link href={route('services')} className="text-sm hover:underline">{t('navigation.services', 'Services')}</Link>
                <Link href={route('portfolio')} className="text-sm hover:underline">{t('navigation.portfolio', 'Portfolio')}</Link>
                <Link href={route('team')} className="text-sm hover:underline">{t('navigation.team', 'Team')}</Link>
                <Link href={route('blog')} className="text-sm hover:underline">{t('navigation.blog', 'Blog')}</Link>
                <Link href={route('contact')} className="text-sm hover:underline">{t('navigation.contact', 'Contact')}</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('footer.legal', 'Legal')}</h3>
              <nav className="flex flex-col gap-2">
                <Link href={route('privacy')} className="text-sm hover:underline">{t('footer.privacy', 'Privacy Policy')}</Link>
                <Link href={route('terms')} className="text-sm hover:underline">{t('footer.terms', 'Terms of Service')}</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('footer.connect', 'Connect')}</h3>
              <div className="flex gap-4">
                <a href="https://twitter.com/tekrem" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="https://facebook.com/tekrem" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/tekrem" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {t('common.tekremTech', 'TekRem')}. {t('footer.rights', 'All rights reserved.')}
            </p>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ModeToggle />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
