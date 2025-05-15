import React from 'react';
import { Link } from '@inertiajs/react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import usePermissions from '@/Hooks/usePermissions';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  active: boolean;
  permission: string | null;
}

interface AdminNavProps {
  currentRoute: string;
  canViewUsers: boolean;
  canViewRoles: boolean;
  canViewPermissions: boolean;
  navigationItems?: NavigationItem[];
}

export default function AdminNav({
  currentRoute,
  canViewUsers,
  canViewRoles,
  canViewPermissions,
  navigationItems = []
}: AdminNavProps) {
  const { isAdmin } = usePermissions();

  // Admin can view everything
  const userIsAdmin = isAdmin();

  // Override permissions for admin
  if (userIsAdmin) {
    canViewUsers = true;
    canViewRoles = true;
    canViewPermissions = true;
  }

  // Navigation items will be filtered in the render function

  // Determine which tab should be active based on current route and permissions
  let activeTab = 'users';

  if (currentRoute.startsWith('users.') && canViewUsers) {
    activeTab = 'users';
  } else if (currentRoute.startsWith('roles.') && canViewRoles) {
    activeTab = 'roles';
  } else if (currentRoute.startsWith('permissions.') && canViewPermissions) {
    activeTab = 'permissions';
  } else {
    // Default to the first available tab
    if (canViewUsers) {
      activeTab = 'users';
    } else if (canViewRoles) {
      activeTab = 'roles';
    } else if (canViewPermissions) {
      activeTab = 'permissions';
    }
  }

  // Calculate the number of visible tabs for grid layout
  const visibleTabsCount = [canViewUsers, canViewRoles, canViewPermissions].filter(Boolean).length;
  const gridColsClass = visibleTabsCount === 1 ? 'grid-cols-1' :
                        visibleTabsCount === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="border-b bg-card">
      <div className="container py-2">
        <Tabs value={activeTab} className="w-full">
          <TabsList className={`grid w-full md:w-auto ${gridColsClass} md:grid-cols-none md:flex`}>
            {/* Use filtered navigation items for admin section */}
            {navigationItems
              .filter(item =>
                item.permission === 'view_users' ||
                item.permission === 'view_roles' ||
                item.permission === 'view_permissions'
              )
              .map((item, index) => {
                // Determine the value based on permission
                let value = '';
                if (item.permission === 'view_users') value = 'users';
                if (item.permission === 'view_roles') value = 'roles';
                if (item.permission === 'view_permissions') value = 'permissions';

                // Check if this item should be shown based on permissions
                const shouldShow =
                  (item.permission === 'view_users' && canViewUsers) ||
                  (item.permission === 'view_roles' && canViewRoles) ||
                  (item.permission === 'view_permissions' && canViewPermissions);

                return shouldShow ? (
                  <TabsTrigger
                    key={index}
                    value={value}
                    asChild
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      {React.createElement(item.icon, { className: "h-4 w-4" })}
                      <span className="hidden sm:inline">{item.name}</span>
                    </Link>
                  </TabsTrigger>
                ) : null;
              })}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
