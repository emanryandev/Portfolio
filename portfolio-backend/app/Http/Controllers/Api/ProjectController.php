<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Project\ProjectResource;
use App\Services\Project\ProjectService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    /**
     * Public endpoint to list all published projects.
     */
    public function index(): AnonymousResourceCollection
    {
        return ProjectResource::collection($this->projectService->getPublishedProjects());
    }

    /**
     * Public endpoint to get featured projects.
     */
    public function featured(): JsonResponse
    {
        $projects = $this->projectService->getFeaturedProjects();

        return response()->json([
            'data' => ProjectResource::collection($projects)
        ]);
    }

    /**
     * Public endpoint to get project details by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $project = $this->projectService->getProjectBySlug($slug);

        return response()->json([
            'data' => new ProjectResource($project)
        ]);
    }
}
