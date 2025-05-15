# Login Instructions for TekRem Auth Service

## Admin User Credentials

You can now log in to the auth service using the following admin credentials:

- **Email**: admin@tekrem.com
- **Password**: password

This admin user has all the necessary permissions to access users, roles, and permissions management.

## Other Test Users

The following test users have also been created:

1. **Manager User**
   - Email: test@example.com
   - Password: password
   - Role: manager
   - Permissions: view_users, create_users, edit_users, view_roles, view_permissions

2. **Regular Users**
   - Various regular users with the 'user' role
   - Permissions: view_users

## Accessing the Admin Features

After logging in as the admin user, you should be able to access:

1. **Users Management**: `/users`
2. **Roles Management**: `/roles`
3. **Permissions Management**: `/permissions`

## Troubleshooting

If you still encounter "Forbidden" errors after logging in as the admin user, try the following:

1. **Clear Browser Cache**: Your browser might be caching old session data.

2. **Clear Application Cache**:
   ```bash
   php artisan cache:clear
   php artisan config:clear
   php artisan route:clear
   php artisan view:clear
   ```

3. **Restart the Application**:
   ```bash
   php artisan serve
   ```

4. **Check Session Storage**: Make sure your session storage is working correctly.

5. **Verify Permissions**: Run the check-permissions.php script to verify that the admin user has the correct permissions:
   ```bash
   php check-permissions.php
   ```

## Additional Notes

- The roles and permissions are defined in the `RolesAndPermissionsSeeder` class.
- The authorization logic is implemented in the `AuthServiceProvider` class.
- Each controller method checks for the appropriate permission using the `Gate::allows()` method.

If you need to modify permissions or roles, you can edit the seeder and run it again:

```bash
php artisan db:seed --class=RolesAndPermissionsSeeder
```
