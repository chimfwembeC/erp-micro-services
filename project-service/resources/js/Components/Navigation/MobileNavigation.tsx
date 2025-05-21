import React from 'react';
import { Link } from '@inertiajs/react';
import { Menu, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NavigationItem, Team } from '@/types';

interface MobileNavigationProps {
  t: (key: string) => string;
  authorizedNavItems: NavigationItem[];
  user: any;
  hasApiFeatures: boolean;
  hasTeamFeatures: boolean;
  managesProfilePhotos: boolean;
  route: any;
  logout: (e: React.FormEvent) => void;
  switchToTeam: (e: React.FormEvent, team: Team) => void;
  canCreateTeams: boolean;
}

export default function MobileNavigation({
  t,
  authorizedNavItems,
  user,
  hasApiFeatures,
  hasTeamFeatures,
  managesProfilePhotos,
  route,
  logout,
  switchToTeam,
  canCreateTeams
}: MobileNavigationProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">{t('common.navigation')}</h4>
            <div className="grid gap-2">
              {/* Render authorized navigation items */}
              {authorizedNavItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-accent ${item.active ? 'bg-accent text-accent-foreground' : ''}`}
                >
                  {React.createElement(item.icon, { className: "h-4 w-4" })}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">{t('common.account')}</h4>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 px-3 py-2">
                {managesProfilePhotos ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profile_photo_url} alt={user?.name || ''} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                )}
                <div className="grid gap-0.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <Link
                href={route('profile.show')}
                className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-accent"
              >
                <User className="h-4 w-4" />
                {t('common.profile')}
              </Link>

              {hasApiFeatures && (
                <Link
                  href={route('api-tokens.index')}
                  className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-accent"
                >
                  <Settings className="h-4 w-4" />
                  {t('common.apiTokens')}
                </Link>
              )}

              <button
                onClick={logout}
                className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-accent w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                {t('common.logout')}
              </button>
            </div>
          </div>

          {/* Teams Section (Mobile) */}
          {hasTeamFeatures && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">{t('common.teams')}</h4>
              <div className="grid gap-2">
                <Link
                  href={route('teams.show', [user?.current_team!])}
                  className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-accent"
                >
                  {t('common.teamSettings')}
                </Link>

                {canCreateTeams && (
                  <Link
                    href={route('teams.create')}
                    className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-accent"
                  >
                    {t('common.createNewTeam')}
                  </Link>
                )}

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground px-3 pb-1">{t('common.switchTeams')}</p>
                  {user?.all_teams?.map((team: Team) => (
                    <form onSubmit={e => switchToTeam(e, team)} key={team.id}>
                      <button
                        className="flex items-center justify-between w-full text-sm px-3 py-2 rounded-md hover:bg-accent"
                      >
                        <span>{team.name}</span>
                        {team.id == user?.current_team_id && (
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        )}
                      </button>
                    </form>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
