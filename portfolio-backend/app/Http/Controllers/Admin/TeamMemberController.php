<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TeamMemberRequest;
use App\Http\Resources\Admin\TeamMemberResource;
use App\Models\TeamMember;
use App\Services\Team\TeamService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class TeamMemberController extends Controller
{
    use AuthorizesRequests;

    protected TeamService $teamService;

    public function __construct(TeamService $teamService)
    {
        $this->teamService = $teamService;
    }

    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', TeamMember::class);
        
        $members = $this->teamService->getAllMembersAdmin();

        return TeamMemberResource::collection($members);
    }

    public function store(TeamMemberRequest $request): JsonResponse
    {
        $this->authorize('create', TeamMember::class);

        $member = $this->teamService->createMember($request->validated());

        return response()->json([
            'message' => 'Team member created successfully',
            'data' => new TeamMemberResource($member)
        ], 201);
    }

    public function show(TeamMember $teamMember): JsonResponse
    {
        $this->authorize('view', $teamMember);

        return response()->json([
            'data' => new TeamMemberResource($teamMember)
        ]);
    }

    public function update(TeamMemberRequest $request, TeamMember $teamMember): JsonResponse
    {
        $this->authorize('update', $teamMember);

        $member = $this->teamService->updateMember($teamMember, $request->validated());

        return response()->json([
            'message' => 'Team member updated successfully',
            'data' => new TeamMemberResource($member)
        ]);
    }

    public function destroy(TeamMember $teamMember): JsonResponse
    {
        $this->authorize('delete', $teamMember);

        $this->teamService->deleteMember($teamMember);

        return response()->json([
            'message' => 'Team member deleted successfully'
        ], 204);
    }
}
