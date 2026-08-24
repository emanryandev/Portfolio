<x-mail::message>
# New Contact Request

You have received a new contact request from **{{ $contactRequest->name }}**.

**Email:** {{ $contactRequest->email }}
@if($contactRequest->phone)
**Phone:** {{ $contactRequest->phone }}
@endif

## Message / Project Description
{{ $contactRequest->message }}

@if($contactRequest->budget)
**Budget:** {{ $contactRequest->budget }}
@endif

<x-mail::button :url="config('app.frontend_url') . '/admin/contact-requests'">
View in Admin Studio
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
