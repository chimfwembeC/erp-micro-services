import React from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '@/i18n';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    console.log('Changing language to:', lng);
    i18n.changeLanguage(lng);
  };

  // Get current language details
  const currentLang = languages[i18n.language as keyof typeof languages] || languages.en;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('common.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.keys(languages).map((lng) => {
          const lang = languages[lng as keyof typeof languages];
          return (
            <DropdownMenuItem
              key={lng}
              onClick={() => changeLanguage(lng)}
              className="cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="mr-2">{lang.flag}</span>
                {lang.nativeName}
              </div>
              {i18n.language === lng && (
                <div className="h-2 w-2 rounded-full bg-primary"></div>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
