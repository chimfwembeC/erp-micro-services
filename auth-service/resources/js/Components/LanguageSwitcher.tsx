import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '@/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import useTypedPage from '@/Hooks/useTypedPage';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const { props } = useTypedPage();

  // Initialize language from backend if available
  useEffect(() => {
    if (props.locale?.preferred) {
      i18n.changeLanguage(props.locale.preferred);
    } else if (props.locale?.current) {
      i18n.changeLanguage(props.locale.current);
    }
  }, [props.locale]);

  const changeLanguage = (lng: string) => {
    // Just change the language - the i18n listener will handle the rest
    i18n.changeLanguage(lng);
  };

  // Get current language
  const currentLanguage = languages[i18n.language as keyof typeof languages] || languages.en;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('common.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.keys(languages).map((lng) => (
          <DropdownMenuItem
            key={lng}
            onClick={() => changeLanguage(lng)}
            className={`flex items-center gap-2 ${i18n.language === lng ? 'font-bold' : ''}`}
          >
            <span>{languages[lng as keyof typeof languages].flag}</span>
            <span>{languages[lng as keyof typeof languages].nativeName}</span>
            {i18n.language === lng && (
              <span className="ml-auto h-2 w-2 rounded-full bg-primary"></span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
