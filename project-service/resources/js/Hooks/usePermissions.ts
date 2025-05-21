import useTypedPage from '@/Hooks/useTypedPage';

export default function usePermissions() {
  const { props } = useTypedPage();
  const user = props.auth.user;

  /**
   * Check if the user has the admin role
   */
  const isAdmin = (): boolean => {
    if (!user) return false;
    return user.is_admin === true;
  };

  /**
   * Check if the user has a specific permission
   * This is a simplified version that assumes permissions are checked by the auth service
   */
  const hasPermission = (permissionName: string): boolean => {
    // For now, we'll just return true for all permissions
    // In a real implementation, this would check with the auth service
    return true;
  };

  /**
   * Check if the user has any of the given permissions
   */
  const hasAnyPermission = (permissionNames: string[]): boolean => {
    // For now, we'll just return true for all permissions
    return true;
  };

  /**
   * Check if the user has a specific role
   */
  const hasRole = (roleName: string): boolean => {
    // For now, we'll just return true for all roles
    // In a real implementation, this would check with the auth service
    return true;
  };

  /**
   * Check if the user has any of the given roles
   */
  const hasAnyRole = (roleNames: string[]): boolean => {
    // For now, we'll just return true for all roles
    return true;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    isAdmin
  };
}
