<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CustomerWelcome extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The user instance.
     *
     * @var \App\Models\User
     */
    public $user;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        // Get user's preferred language or default to English
        $locale = $this->user->preferred_language ?? config('app.locale');

        // Determine subject based on locale
        $subject = match($locale) {
            'bem' => 'Mwaiseni ku TekRem - Akaunti Yenu Yaiteyanya!',
            'nya' => 'Takulandirani ku TekRem - Akaunti Yanu Yakonzeka!',
            'toi' => 'Twamuswaya ku TekRem - Akaunti Yanu Yalibambila!',
            default => 'Welcome to TekRem - Your Account is Ready!',
        };

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // Get user's preferred language or default to English
        $locale = $this->user->preferred_language ?? config('app.locale');

        // Determine which template to use based on locale
        $template = match($locale) {
            'bem' => 'emails.customer.welcome.bem',
            'nya' => 'emails.customer.welcome.nya',
            'toi' => 'emails.customer.welcome.toi',
            default => 'emails.customer.welcome',
        };

        return new Content(
            markdown: $template,
            with: [
                'name' => $this->user->name,
                'url' => route('dashboard'),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
