import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Team } from '@/types';

interface TeamDropdownProps {
  t: (key: string) => string;
  user: any;
  canCreateTeams: boolean;
  route: any;
  switchToTeam: (e: React.FormEvent, team: Team) => void;
}

export default function TeamDropdown({
  t,
  user,
  canCreateTeams,
  route,
  switchToTeam
}: TeamDropdownProps) {
  return (
    <div className="hidden md:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            {user?.current_team?.name}
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t('common.manageTeam')}</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={route('teams.show', [user?.current_team!])}>
              {t('common.teamSettings')}
            </Link>
          </DropdownMenuItem>

          {canCreateTeams && (
            <DropdownMenuItem asChild>
              <Link href={route('teams.create')}>
                {t('common.createNewTeam')}
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuLabel>{t('common.switchTeams')}</DropdownMenuLabel>

          {user?.all_teams?.map((team: Team) => (
            <form onSubmit={e => switchToTeam(e, team)} key={team.id}>
              <DropdownMenuItem asChild>
                <button className="w-full flex items-center justify-between">
                  <span>{team.name}</span>
                  {team.id == user?.current_team_id && (
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  )}
                </button>
              </DropdownMenuItem>
            </form>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
