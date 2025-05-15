import React from 'react';
import { Link } from '@inertiajs/react';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent
} from '@/components/ui/navigation-menu';
import { NavigationItem } from '@/types';

interface AdminNavigationMenuProps {
  t: (key: string) => string;
  navigationItems: NavigationItem[];
  hasPermission: (permission: string) => boolean;
  userIsAdmin: boolean;
}

export default function AdminNavigationMenu({
  t,
  navigationItems,
  hasPermission,
  userIsAdmin
}: AdminNavigationMenuProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{t('common.administration')}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="w-[220px] p-2">
          {/* Filter admin navigation items based on permissions */}
          {navigationItems.filter(item =>
            item.permission !== null &&
            (item.permission === 'view_users' ||
             item.permission === 'view_roles' ||
             item.permission === 'view_permissions') &&
            (hasPermission(item.permission) || userIsAdmin)
          ).map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="flex items-center gap-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                {React.createElement(item.icon, { className: "h-4 w-4" })}
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
