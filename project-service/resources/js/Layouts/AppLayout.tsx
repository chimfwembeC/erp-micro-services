import { router } from '@inertiajs/core';
import { Link, Head } from '@inertiajs/react';
import React, { PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import usePermissions from '@/Hooks/usePermissions';
import ApplicationMark from '@/Components/ApplicationMark';
import Banner from '@/Components/Banner';
import AdminNav from '@/Components/AdminNav';
import { Toaster } from '@/components/ui/sonner';
import { Team } from '@/types';
import { ModeToggle } from '@/Components/ModeToggle';
import { LanguageSwitcher } from '@/Components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Menu,
  User,
  LogOut,
  Settings,
  ChevronsUpDown,
  Users,
  ShieldCheck,
  Lock,
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Clock
} from 'lucide-react';

interface Props {
  title: string;
  renderHeader?(): JSX.Element;
}

export default function AppLayout({
  title,
  renderHeader,
  children,
}: PropsWithChildren<Props>) {
  const page = useTypedPage();
  const route = useRoute();
  const { t } = useTranslation();
  const { hasPermission, hasAnyPermission, hasRole, isAdmin } = usePermissions();
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);

  // Define navigation items with permission checks
  const navigationItems = [
    {
      name: t('common.dashboard'),
      href: route('dashboard'),
      icon: LayoutDashboard,
      active: route().current('dashboard'),
      permission: null // Everyone can access dashboard
    },
    // Project Management
    {
      name: t('projects.title'),
      href: route('projects.index'),
      icon: Briefcase,
      active: route().current('projects.*'),
      permission: null // Everyone can access projects
    },
    {
      name: t('tasks.title'),
      href: route('tasks.index'),
      icon: CheckSquare,
      active: route().current('tasks.*'),
      permission: null // Everyone can access tasks
    },
    {
      name: t('time_logs.title'),
      href: route('time-logs.index'),
      icon: Clock,
      active: route().current('time-logs.*'),
      permission: null // Everyone can access time logs
    }
  ];



  // Filter navigation items based on permissions
  const authorizedNavItems = navigationItems.filter(item =>
    item.permission === null || hasPermission(item.permission)
  );

  function switchToTeam(e: React.FormEvent, team: Team) {
    e.preventDefault();
    router.put(
      route('current-team.update'),
      {
        team_id: team.id,
      },
      {
        preserveState: false,
      },
    );
  }

  function logout(e: React.FormEvent) {
    e.preventDefault();
    router.post(route('logout'));
  }

  return (
    <div>
      <Head title={title} />
      <Toaster position="top-right" />
      <Banner />

      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between">
            <div className="flex items-center gap-6 md:gap-10">
              {/* Logo */}
              <Link href={route('dashboard')} className="flex items-center space-x-2">
                <ApplicationMark className="h-9 w-auto" />
              </Link>

              {/* Desktop Navigation */}
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                  {/* Dashboard is always visible */}
                  <NavigationMenuItem>
                    <Link href={route('dashboard')} className={navigationMenuTriggerStyle()}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {t('common.dashboard')}
                    </Link>
                  </NavigationMenuItem>

                  {/* Project Management section */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>{t('projects.title')}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <Link
                          href={route('projects.index')}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none">
                            <Briefcase className="h-4 w-4" />
                            {t('projects.all_projects')}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-2">
                            {t('projects.create_description')}
                          </p>
                        </Link>
                        <Link
                          href={route('tasks.index')}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none">
                            <CheckSquare className="h-4 w-4" />
                            {t('tasks.all_tasks')}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-2">
                            {t('tasks.create_description')}
                          </p>
                        </Link>
                        <Link
                          href={route('tasks.my-tasks')}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none">
                            <CheckSquare className="h-4 w-4" />
                            {t('tasks.my_tasks')}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-2">
                            {t('tasks.create_description')}
                          </p>
                        </Link>
                        <Link
                          href={route('time-logs.index')}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none">
                            <Clock className="h-4 w-4" />
                            {t('time_logs.title')}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-2">
                            {t('time_logs.all_time_logs_description')}
                          </p>
                        </Link>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>


                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Theme Toggle */}
              <ModeToggle />

              {/* Teams Dropdown (Desktop) */}
              {page.props.jetstream.hasTeamFeatures && (
                <div className="hidden md:flex">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-1">
                        {page.props.auth.user?.current_team?.name}
                        <ChevronsUpDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>{t('common.manageTeam')}</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={route('teams.show', [page.props.auth.user?.current_team!])}>
                          {t('common.teamSettings')}
                        </Link>
                      </DropdownMenuItem>

                      {page.props.jetstream.canCreateTeams && (
                        <DropdownMenuItem asChild>
                          <Link href={route('teams.create')}>
                            {t('common.createNewTeam')}
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>{t('common.switchTeams')}</DropdownMenuLabel>

                      {page.props.auth.user?.all_teams?.map(team => (
                        <form onSubmit={e => switchToTeam(e, team)} key={team.id}>
                          <DropdownMenuItem asChild>
                            <button className="w-full flex items-center justify-between">
                              <span>{team.name}</span>
                              {team.id == page.props.auth.user?.current_team_id && (
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                              )}
                            </button>
                          </DropdownMenuItem>
                        </form>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* User Dropdown (Desktop) */}
              <div className="hidden md:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {page.props.jetstream.managesProfilePhotos ? (
                      <Avatar className="h-8 w-8 cursor-pointer">
                        <AvatarImage src={page.props.auth.user?.profile_photo_url} alt={page.props.auth.user?.name || ''} />
                        <AvatarFallback>{page.props.auth.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar>
                          <AvatarFallback>{page.props.auth.user?.name?.charAt(0) || 'U'}</AvatarFallback>
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

                    {page.props.jetstream.hasApiFeatures && (
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

              {/* Mobile Menu */}
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
                          {page.props.jetstream.managesProfilePhotos ? (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={page.props.auth.user?.profile_photo_url} alt={page.props.auth.user?.name || ''} />
                              <AvatarFallback>{page.props.auth.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{page.props.auth.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                          )}
                          <div className="grid gap-0.5">
                            <p className="text-sm font-medium">{page.props.auth.user?.name}</p>
                            <p className="text-xs text-muted-foreground">{page.props.auth.user?.email}</p>
                          </div>
                        </div>

                        <Link
                          href={route('profile.show')}
                          className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-accent"
                        >
                          <User className="h-4 w-4" />
                          {t('common.profile')}
                        </Link>

                        {page.props.jetstream.hasApiFeatures && (
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
                    {page.props.jetstream.hasTeamFeatures && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">{t('common.teams')}</h4>
                        <div className="grid gap-2">
                          <Link
                            href={route('teams.show', [page.props.auth.user?.current_team!])}
                            className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-accent"
                          >
                            {t('common.teamSettings')}
                          </Link>

                          {page.props.jetstream.canCreateTeams && (
                            <Link
                              href={route('teams.create')}
                              className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-accent"
                            >
                              {t('common.createNewTeam')}
                            </Link>
                          )}

                          <div className="pt-2">
                            <p className="text-xs text-muted-foreground px-3 pb-1">{t('common.switchTeams')}</p>
                            {page.props.auth.user?.all_teams?.map(team => (
                              <form onSubmit={e => switchToTeam(e, team)} key={team.id}>
                                <button
                                  className="flex items-center justify-between w-full text-sm px-3 py-2 rounded-md hover:bg-accent"
                                >
                                  <span>{team.name}</span>
                                  {team.id == page.props.auth.user?.current_team_id && (
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
            </div>
          </div>
        </header>

        {/* Admin Navigation */}
        {/* {(route().current('users.*') || route().current('roles.*') || route().current('permissions.*')) && (userIsAdmin || canAccessAdminSection) ? (
          <AdminNav
            currentRoute={route().current() || ''}
            canViewUsers={canViewUsers}
            canViewRoles={canViewRoles}
            canViewPermissions={canViewPermissions}
            navigationItems={navigationItems.filter(item =>
              item.permission !== null &&
              (hasPermission(item.permission) || userIsAdmin)
            )}
          />
        ) : null} */}

        {/* Page Heading */}
        {renderHeader ? (
          <div className="bg-card border-b">
            <div className="container py-4 mx-auto">
              {renderHeader()}
            </div>
          </div>
        ) : null}

        {/* Page Content */}
        <main className="container mx-auto py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
