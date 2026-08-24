<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServiceRequest;
use App\Http\Resources\Admin\ServiceResource;
use App\Models\Service;
use App\Services\Service\ServiceManager;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    use AuthorizesRequests;

    protected ServiceManager $serviceManager;

    public function __construct(ServiceManager $serviceManager)
    {
        $this->serviceManager = $serviceManager;
    }

    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Service::class);

        $services = $this->serviceManager->getAllServices();

        return ServiceResource::collection($services);
    }

    public function store(ServiceRequest $request): JsonResponse
    {
        $this->authorize('create', Service::class);

        $service = $this->serviceManager->createService($request->validated());

        return response()->json([
            'message' => 'Service created successfully',
            'data' => new ServiceResource($service)
        ], 201);
    }

    public function show(Service $service): JsonResponse
    {
        $this->authorize('view', $service);
        
        $service->load('features');

        return response()->json([
            'data' => new ServiceResource($service)
        ]);
    }

    public function update(ServiceRequest $request, Service $service): JsonResponse
    {
        $this->authorize('update', $service);

        $service = $this->serviceManager->updateService($service, $request->validated());

        return response()->json([
            'message' => 'Service updated successfully',
            'data' => new ServiceResource($service)
        ]);
    }

    public function destroy(Service $service): JsonResponse
    {
        $this->authorize('delete', $service);

        $this->serviceManager->deleteService($service);

        return response()->json([
            'message' => 'Service deleted successfully'
        ], 204);
    }
}
