import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '@/i18n';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import { User } from '@/types';

interface LanguagePreferenceProps {
  user: User;
}

export default function LanguagePreference({ user }: LanguagePreferenceProps) {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(user.preferred_language || i18n.language || 'en');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
  };

  const saveLanguagePreference = async () => {
    setIsSubmitting(true);
    try {
      // Update frontend language immediately for better UX
      i18n.changeLanguage(selectedLanguage);
      
      // Send request to backend to update language preference
      const response = await axios.post('/api/language/change', { language: selectedLanguage });
      
      if (response.data.success) {
        toast.success(t('common.languageChanged'));
      }
    } catch (error) {
      console.error('Failed to change language:', error);
      toast.error(t('common.languageChangeError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.languagePreference')}</CardTitle>
        <CardDescription>{t('profile.selectYourPreferredLanguage')}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedLanguage} onValueChange={handleLanguageChange} className="space-y-4">
          {Object.entries(languages).map(([code, { nativeName, flag }]) => (
            <div key={code} className="flex items-center space-x-2">
              <RadioGroupItem value={code} id={`language-${code}`} />
              <Label htmlFor={`language-${code}`} className="flex items-center gap-2 cursor-pointer">
                <span>{flag}</span>
                <span>{nativeName}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={saveLanguagePreference} 
          disabled={isSubmitting || selectedLanguage === (user.preferred_language || i18n.language)}
        >
          {isSubmitting ? t('common.saving') : t('common.save')}
        </Button>
      </CardFooter>
    </Card>
  );
}
