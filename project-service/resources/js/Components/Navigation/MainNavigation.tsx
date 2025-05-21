import React from 'react';
import { Link } from '@inertiajs/react';
import { LayoutDashboard } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import AdminNavigationMenu from './AdminNavigationMenu';
import { NavigationItem } from '@/types';

interface MainNavigationProps {
  route: any;
  t: (key: string) => string;
  canAccessAdminSection: boolean;
  navigationItems: NavigationItem[];
  hasPermission: (permission: string) => boolean;
  userIsAdmin: boolean;
}

export default function MainNavigation({
  route,
  t,
  canAccessAdminSection,
  navigationItems,
  hasPermission,
  userIsAdmin
}: MainNavigationProps) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {/* Dashboard is always visible */}
        <NavigationMenuItem>
          <Link href={route('dashboard')} className={navigationMenuTriggerStyle()}>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            {t('common.dashboard')}
          </Link>
        </NavigationMenuItem>

        {/* Admin section with conditional rendering */}
        {canAccessAdminSection && (
          <AdminNavigationMenu
            t={t}
            navigationItems={navigationItems}
            hasPermission={hasPermission}
            userIsAdmin={userIsAdmin}
          />
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
