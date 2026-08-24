<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Response;
use App\Models\Project;
use App\Models\TeamMember;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $sitemap = Cache::remember('sitemap_xml', 3600, function () {
            $projects = Project::where('status', 'completed')->get();
            $teamMembers = TeamMember::all();
            
            return view('sitemap', [
                'projects' => $projects,
                'teamMembers' => $teamMembers,
                'frontendUrl' => config('app.frontend_url', 'https://your-domain.com')
            ])->render();
        });

        return response($sitemap, 200, [
            'Content-Type' => 'application/xml'
        ]);
    }
}
