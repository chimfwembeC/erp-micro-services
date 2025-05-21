<x-mail::message>
# Welcome to TekRem, {{ $name }}!

Thank you for registering with TekRem. Your customer account has been created successfully.

## Your Customer Account

As a customer, you now have access to:

- View and manage your profile
- Place and track orders
- View and download invoices
- Submit and track support tickets

<x-mail::button :url="$url">
    Access Your Dashboard
</x-mail::button>

If you have any questions or need assistance, please don't hesitate to contact our support team.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
