import React from 'react';
import { Link } from '@inertiajs/react';
import { User, LogOut, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface UserDropdownProps {
  t: (key: string) => string;
  user: any;
  managesProfilePhotos: boolean;
  hasApiFeatures: boolean;
  route: any;
  logout: (e: React.FormEvent) => void;
}

export default function UserDropdown({
  t,
  user,
  managesProfilePhotos,
  hasApiFeatures,
  route,
  logout
}: UserDropdownProps) {
  return (
    <div className="hidden md:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {managesProfilePhotos ? (
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={user?.profile_photo_url} alt={user?.name || ''} />
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          ) : (
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar>
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('common.manageAccount')}</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={route('profile.show')} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>{t('common.profile')}</span>
            </Link>
          </DropdownMenuItem>

          {hasApiFeatures && (
            <DropdownMenuItem asChild>
              <Link href={route('api-tokens.index')} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('common.apiTokens')}</span>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild onClick={logout}>
            <button className="w-full cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('common.logout')}</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
