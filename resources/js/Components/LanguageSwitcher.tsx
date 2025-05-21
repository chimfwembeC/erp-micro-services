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
import { toast } from 'sonner';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    try {
      i18n.changeLanguage(lng);
      localStorage.setItem('i18nextLng', lng);
      toast.success(t('common.languageChanged', 'Language changed successfully'));
    } catch (error) {
      console.error('Error changing language:', error);
      toast.error(t('common.languageChangeError', 'Failed to change language'));
    }
  };

  // Get current language with fallback
  const currentLngKey = i18n.language?.split('-')[0] || 'en';
  const currentLanguage = languages[currentLngKey as keyof typeof languages] || languages.en;

  // Ensure language is set from localStorage on component mount
  useEffect(() => {
    const savedLng = localStorage.getItem('i18nextLng');
    if (savedLng && savedLng !== i18n.language) {
      i18n.changeLanguage(savedLng);
    }
  }, []);

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
            className={`flex items-center gap-2 ${currentLngKey === lng ? 'font-bold' : ''}`}
          >
            <span>{languages[lng as keyof typeof languages].flag}</span>
            <span>{languages[lng as keyof typeof languages].nativeName}</span>
            {currentLngKey === lng && (
              <span className="ml-auto h-2 w-2 rounded-full bg-primary"></span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
