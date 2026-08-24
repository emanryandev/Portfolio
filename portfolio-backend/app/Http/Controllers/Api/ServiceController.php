<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Service\ServiceResource;
use App\Services\Service\ServiceManager;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    protected ServiceManager $serviceManager;

    public function __construct(ServiceManager $serviceManager)
    {
        $this->serviceManager = $serviceManager;
    }

    /**
     * Public endpoint to list all services/packages.
     */
    public function index(): AnonymousResourceCollection
    {
        $services = $this->serviceManager->getAllServices();
        return ServiceResource::collection($services);
    }

    /**
     * Public endpoint to get a specific service by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $service = $this->serviceManager->getServiceBySlug($slug);

        return response()->json([
            'data' => new ServiceResource($service)
        ]);
    }
}
