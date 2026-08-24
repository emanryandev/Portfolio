<?php

namespace App\Services\Contact;

use App\Models\ContactRequest;
use App\Models\TeamMember;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Pagination\LengthAwarePaginator;

class ContactService
{
    /**
     * Store a new contact request and attach recipients.
     */
    public function storeContactRequest(array $data): ContactRequest
    {
        DB::beginTransaction();
        try {
            $recipients = $data['recipients'] ?? [];
            unset($data['recipients']);

            $contactRequest = ContactRequest::create($data);

            if (empty($recipients)) {
                $recipients = TeamMember::pluck('id')->toArray();
            }
            
            if (!empty($recipients)) {
                $contactRequest->recipients()->attach($recipients);
            }

            DB::commit();

            \App\Events\ContactRequestSubmitted::dispatch($contactRequest);

            return $contactRequest;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to store contact request: ' . $e->getMessage());
            throw $e;
        }
    }

    // ----------------------------------------------------
    // Admin Methods
    // ----------------------------------------------------

    public function getAllContactRequestsAdmin(): LengthAwarePaginator
    {
        return ContactRequest::with(['service', 'recipients'])
            ->orderByDesc('created_at')
            ->paginate(15);
    }

    public function getContactRequestById(int $id): ContactRequest
    {
        return ContactRequest::with(['service', 'recipients'])
            ->findOrFail($id);
    }

    public function updateContactRequestStatus(ContactRequest $contactRequest, array $data): ContactRequest
    {
        $contactRequest->update($data);
        return $contactRequest->load(['service', 'recipients']);
    }

    public function deleteContactRequest(ContactRequest $contactRequest): void
    {
        DB::beginTransaction();
        try {
            $contactRequest->recipients()->detach();
            $contactRequest->delete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete contact request: ' . $e->getMessage());
            throw $e;
        }
    }
}
