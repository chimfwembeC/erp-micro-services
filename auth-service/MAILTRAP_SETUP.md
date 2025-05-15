# Setting Up Mailtrap for Laravel Email Testing

This guide will help you set up Mailtrap to test email functionality in your Laravel application without sending real emails.

## What is Mailtrap?

Mailtrap is a fake SMTP server for development teams to test, view, and share emails sent from the development and staging environments without sending them to real customers.

## Step 1: Create a Mailtrap Account

1. Go to [Mailtrap.io](https://mailtrap.io/) and sign up for a free account
   - You can sign up with your email, Google, GitHub, or other social accounts
   - The free plan is sufficient for development purposes

2. After signing up, you'll be redirected to your Mailtrap dashboard

## Step 2: Get Your Mailtrap Credentials

1. In your Mailtrap dashboard, click on the "Email Testing" tab in the left sidebar

2. You should see an "Inboxes" section with a default inbox (or create a new one)
   - If you don't see a default inbox, click on "Add Inbox" to create one
   - Give your inbox a name like "TekRem ERP"

3. Click on the inbox you want to use

4. In the inbox view, look for the "SMTP Settings" section on the right side
   - You'll see your SMTP credentials including host, port, username, and password

5. In the "Integrations" dropdown, select "Laravel"
   - Mailtrap will show you the configuration code specifically formatted for Laravel

6. Copy the credentials from the displayed configuration

## Step 3: Update Your Laravel .env File

1. Copy the credentials from Mailtrap and update your `.env` file:

```
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@tekrem.com"
MAIL_FROM_NAME="${APP_NAME}"
```

2. Replace `your_mailtrap_username` and `your_mailtrap_password` with the credentials provided by Mailtrap.

3. The credentials will look something like this:
   - Username: a1b2c3d4e5f6g7
   - Password: 1a2b3c4d5e6f7g

4. Make sure to use the exact credentials shown in your Mailtrap dashboard.

5. Save the `.env` file after making these changes.

6. Restart your Laravel server to apply the changes:
   ```bash
   php artisan serve
   ```

## Step 4: Test Your Configuration

1. You can test your Mailtrap configuration using the provided test command:

```bash
php artisan email:test test@example.com
```

2. After running this command, check your Mailtrap inbox - you should see the test email there.

3. To view the email in Mailtrap:
   - Go to your Mailtrap dashboard
   - Click on the inbox you configured
   - You should see the test email in the list
   - Click on the email to view its content, HTML structure, and other details

4. If the test is successful, you'll see a message like:
   ```
   Sending test email to test@example.com...
   Test email sent successfully!
   ```

5. If there's an error, check that your Mailtrap credentials are correct in the `.env` file.

## Step 5: Using Mailtrap for Email Verification

When users register in your application, the verification emails will be sent to Mailtrap instead of real email addresses. To test the email verification process:

1. Register a new user in your application:
   - Go to your application's registration page
   - Fill in the registration form with a test email address
   - Submit the form

2. Check your Mailtrap inbox for the verification email:
   - Go to your Mailtrap dashboard
   - Click on the inbox you configured
   - You should see a new verification email in the list
   - Click on the email to view its content

3. Use the verification link:
   - In Mailtrap, find the verification link in the email
   - You can either:
     - Click on the link directly in Mailtrap (it will open in a new tab)
     - Copy the link and paste it into your browser
   - Note: Mailtrap may modify links in emails for security, so make sure you're using the correct URL

4. Complete the verification:
   - After clicking the link, you should be redirected to your application
   - The user's email should now be verified
   - You should be able to log in with the verified account

## Benefits of Using Mailtrap

- **Safety**: No risk of sending test emails to real users
- **Centralized Testing**: All emails are captured in your Mailtrap inbox
- **Comprehensive Inspection**: You can inspect the HTML, text, and raw versions of emails
- **Quality Checks**: You can check for spam scores and validate your email content
- **Team Collaboration**: Multiple team members can access the same inbox
- **Offline Testing**: You can test email functionality without an internet connection
- **Debugging**: Easily debug email-related issues without affecting real users

## Mailtrap Features

1. **Email Testing**:
   - View HTML, Text, and Raw versions of emails
   - Check email headers and content
   - Test responsive design with the HTML preview

2. **Email Analysis**:
   - Spam score analysis
   - HTML validation
   - Blacklist reports

3. **Team Collaboration**:
   - Share inboxes with team members
   - Add comments to emails
   - Set up notifications

## Mailtrap Free Plan Limitations

The free plan of Mailtrap includes:
- 1 inbox
- 100 emails per month
- 1 day email retention
- Basic HTML/spam analysis

This is sufficient for most development and testing needs. If you need more features, Mailtrap offers paid plans with additional capabilities.

## Troubleshooting

If you encounter issues with Mailtrap:

1. **Credentials Issues**:
   - Double-check your username and password in the `.env` file
   - Make sure you're using the credentials from the correct inbox

2. **Connection Issues**:
   - Verify that your application can connect to Mailtrap's servers
   - Check if your network allows outgoing connections on port 2525

3. **Email Not Showing Up**:
   - Check if your application is actually sending emails
   - Look for errors in your Laravel logs (`storage/logs/laravel.log`)
   - Verify that you're looking at the correct inbox in Mailtrap
