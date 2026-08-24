<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectContributionRequest;
use App\Http\Resources\Admin\ProjectContributionResource;
use App\Models\ProjectTeamContribution;
use App\Services\Project\ProjectContributionService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class ProjectContributionController extends Controller
{
    use AuthorizesRequests;

    protected ProjectContributionService $contributionService;

    public function __construct(ProjectContributionService $contributionService)
    {
        $this->contributionService = $contributionService;
    }

    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', ProjectTeamContribution::class);

        $contributions = $this->contributionService->getAllContributions();

        return ProjectContributionResource::collection($contributions);
    }

    public function store(ProjectContributionRequest $request): JsonResponse
    {
        $this->authorize('create', ProjectTeamContribution::class);

        $contribution = $this->contributionService->createContribution($request->validated());

        return response()->json([
            'message' => 'Project contribution created successfully',
            'data' => new ProjectContributionResource($contribution)
        ], 201);
    }

    public function show(ProjectTeamContribution $contribution): JsonResponse
    {
        $this->authorize('view', $contribution);
        
        $contribution->load(['project', 'teamMember']);

        return response()->json([
            'data' => new ProjectContributionResource($contribution)
        ]);
    }

    public function update(ProjectContributionRequest $request, ProjectTeamContribution $contribution): JsonResponse
    {
        $this->authorize('update', $contribution);

        $updatedContribution = $this->contributionService->updateContribution($contribution, $request->validated());

        return response()->json([
            'message' => 'Project contribution updated successfully',
            'data' => new ProjectContributionResource($updatedContribution)
        ]);
    }

    public function destroy(ProjectTeamContribution $contribution): JsonResponse
    {
        $this->authorize('delete', $contribution);

        $this->contributionService->deleteContribution($contribution);

        return response()->json([
            'message' => 'Project contribution deleted successfully'
        ], 204);
    }
}
