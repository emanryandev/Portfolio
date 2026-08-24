<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Team\TeamMemberResource;
use App\Services\Team\TeamService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class TeamController extends Controller
{
    protected TeamService $teamService;

    public function __construct(TeamService $teamService)
    {
        $this->teamService = $teamService;
    }

    public function index(): AnonymousResourceCollection
    {
        $members = $this->teamService->getAllActiveMembers();
        return TeamMemberResource::collection($members);
    }

    public function show(string $slug): JsonResponse
    {
        $member = $this->teamService->getMemberBySlug($slug);
        
        return response()->json([
            'data' => new TeamMemberResource($member)
        ]);
    }
}
