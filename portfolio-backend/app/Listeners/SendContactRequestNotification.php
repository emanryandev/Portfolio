<?php

namespace App\Listeners;

use App\Events\ContactRequestSubmitted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendContactRequestNotification implements \Illuminate\Contracts\Queue\ShouldQueue
{
    public bool $afterCommit = true;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(ContactRequestSubmitted $event): void
    {
        $notificationEmail = config('mail.contact_notification_email');
        if ($notificationEmail) {
            \Illuminate\Support\Facades\Mail::to($notificationEmail)->send(new \App\Mail\ContactRequestNotificationMail($event->contactRequest));
        }
    }
}
