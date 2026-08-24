<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\StoreContactRequest;
use App\Services\Contact\ContactService;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    protected ContactService $contactService;

    public function __construct(ContactService $contactService)
    {
        $this->contactService = $contactService;
    }

    /**
     * Public endpoint to submit a contact request.
     */
    public function store(StoreContactRequest $request): JsonResponse
    {
        $contactRequest = $this->contactService->storeContactRequest($request->validated());

        return response()->json([
            'message' => 'Contact request submitted successfully.',
            'data' => [
                'id' => $contactRequest->id,
                'status' => $contactRequest->status,
            ]
        ], 201);
    }
}
