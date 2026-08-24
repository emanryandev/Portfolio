<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateContactRequest;
use App\Http\Resources\Admin\ContactRequestResource;
use App\Models\ContactRequest;
use App\Services\Contact\ContactService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class ContactRequestController extends Controller
{
    use AuthorizesRequests;

    protected ContactService $contactService;

    public function __construct(ContactService $contactService)
    {
        $this->contactService = $contactService;
    }

    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', ContactRequest::class);

        $contactRequests = $this->contactService->getAllContactRequestsAdmin();

        return ContactRequestResource::collection($contactRequests);
    }

    public function show(ContactRequest $contactRequest): JsonResponse
    {
        $this->authorize('view', $contactRequest);
        
        $contactRequest->load(['service', 'recipients']);

        return response()->json([
            'data' => new ContactRequestResource($contactRequest)
        ]);
    }

    public function update(UpdateContactRequest $request, ContactRequest $contactRequest): JsonResponse
    {
        $this->authorize('update', $contactRequest);

        $contactRequest = $this->contactService->updateContactRequestStatus($contactRequest, $request->validated());

        return response()->json([
            'message' => 'Contact request status updated successfully',
            'data' => new ContactRequestResource($contactRequest)
        ]);
    }

    public function destroy(ContactRequest $contactRequest): JsonResponse
    {
        $this->authorize('delete', $contactRequest);

        $this->contactService->deleteContactRequest($contactRequest);

        return response()->json([
            'message' => 'Contact request deleted successfully'
        ], 204);
    }
}
