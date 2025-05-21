# Mailtrap Troubleshooting Guide

## Current Status

The email configuration is currently set to use the `log` driver instead of the `smtp` driver due to authentication issues with Mailtrap. This means that emails are being logged to the Laravel log file (`storage/logs/laravel.log`) instead of being sent to Mailtrap.

## Error Message

When trying to send emails using Mailtrap, the following error was encountered:

```
Failed to authenticate on SMTP server with username "e37f6af57512a8" using the following authenticators: "CRAM-MD5", "LOGIN", "PLAIN". Authenticator "CRAM-MD5" returned "Expected response code "235" but got code "535", with message "535 5.7.0 Too many failed login attempts".". Authenticator "LOGIN" returned "Expected response code "334" but got empty code.". Authenticator "PLAIN" returned "Expected response code "235" but got empty code.".
```

This error indicates that:
1. There have been too many failed login attempts to Mailtrap
2. The account might be temporarily locked
3. The credentials might be incorrect or outdated

## Steps to Fix

### 1. Verify Mailtrap Credentials

1. Log in to your Mailtrap account at https://mailtrap.io/
2. Navigate to your inbox (or create a new one if needed)
3. Find the SMTP credentials for your inbox
4. Verify that the username and password match what's in your `.env` file

### 2. Update .env File

Once you have the correct credentials, update your `.env` file:

1. Open the `.env` file in the auth-service directory
2. Change `MAIL_MAILER=log` to `MAIL_MAILER=smtp`
3. Update the Mailtrap credentials if needed:
   ```
   MAIL_USERNAME=your_new_username
   MAIL_PASSWORD=your_new_password
   ```

### 3. Test the Configuration

After updating the credentials, test the email configuration:

```bash
php artisan email:test test@example.com
```

### 4. Alternative Ports

If you're still having issues, try using a different port. Mailtrap supports several ports:

- 2525 (recommended, works with most network configurations)
- 587
- 465
- 25

Update the `MAIL_PORT` in your `.env` file to try a different port.

### 5. Wait for Account Unlock

If your account is locked due to too many failed attempts, you might need to wait for it to be automatically unlocked. This typically happens after a certain period of time (usually a few hours).

### 6. Contact Mailtrap Support

If you continue to have issues, contact Mailtrap support for assistance.

## Using the Log Driver Temporarily

While troubleshooting Mailtrap issues, you can continue to use the `log` driver to test email functionality. Emails will be logged to `storage/logs/laravel.log` instead of being sent to Mailtrap.

To view the logged emails:

```bash
tail -n 100 storage/logs/laravel.log
```

## Alternative Email Services

If you continue to have issues with Mailtrap, you might consider using an alternative email testing service:

1. **Mailhog**: A local email testing tool that you can run on your development machine
2. **Ethereal**: A free email testing service by Nodemailer
3. **Amazon SES**: A production-ready email service with a free tier

## Switching Back to Log Driver

If you need to switch back to the log driver at any point:

1. Open the `.env` file
2. Change `MAIL_MAILER=smtp` to `MAIL_MAILER=log`

This will cause emails to be logged to the Laravel log file instead of being sent via SMTP.
