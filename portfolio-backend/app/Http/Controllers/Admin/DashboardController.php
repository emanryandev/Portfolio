<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\TeamMember;
use App\Models\Service;
use App\Models\ContactRequest;
use App\Http\Resources\Admin\ProjectResource;
use App\Http\Resources\Admin\ContactRequestResource;

class DashboardController extends Controller
{
    public function summary()
    {
        $projectsCount = Project::count();
        $teamMembersCount = TeamMember::count();
        $servicesCount = Service::count();
        $newContactRequestsCount = ContactRequest::where('status', 'new')->count();

        $recentProjects = Project::latest('created_at')->take(5)->get();
        $recentContactRequests = ContactRequest::latest('created_at')->take(5)->get();

        return response()->json([
            'data' => [
                'metrics' => [
                    'projects' => $projectsCount,
                    'team_members' => $teamMembersCount,
                    'services' => $servicesCount,
                    'new_contact_requests' => $newContactRequestsCount,
                ],
                'recent_projects' => ProjectResource::collection($recentProjects),
                'recent_contact_requests' => ContactRequestResource::collection($recentContactRequests),
            ]
        ]);
    }
}
