import useTypedPage from '@/Hooks/useTypedPage';
import { AppRole } from '@/types';

export default function usePermissions() {
  const { props } = useTypedPage();
  const user = props.auth.user;
  const roles = user?.roles || [];

  console.log('user',user?.roles);
  /**
   * Check if the user has the admin role
   */
  const isAdmin = (): boolean => {
    if (!user) return false;
    return roles.some(role => role.name === 'admin');
  };

  /**
   * Check if the user has a specific permission through any of their roles
   * Admin role automatically has all permissions
   */
  const hasPermission = (permissionName: string): boolean => {
    if (!user) return false;

    // Admin role has all permissions
    if (isAdmin()) return true;

    return roles.some(role =>
      role.permissions?.some(permission => permission.name === permissionName)
    );
  };

  /**
   * Check if the user has any of the given permissions
   * Admin role automatically has all permissions
   */
  const hasAnyPermission = (permissionNames: string[]): boolean => {
    if (!user) return false;

    // Admin role has all permissions
    if (isAdmin()) return true;

    return permissionNames.some(permissionName => hasPermission(permissionName));
  };

  /**
   * Check if the user has a specific role
   */
  const hasRole = (roleName: string): boolean => {
    if (!user) return false;

    return roles.some(role => role.name === roleName);
  };

  /**
   * Check if the user has any of the given roles
   */
  const hasAnyRole = (roleNames: string[]): boolean => {
    if (!user) return false;

    return roleNames.some(roleName => hasRole(roleName));
  };

  /**
   * Get all user roles
   */
  const getUserRoles = (): AppRole[] => {
    return roles;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    getUserRoles,
    isAdmin
  };
}
