<?php

namespace App\Services\Project;

use App\Models\ProjectTeamContribution;
use Illuminate\Pagination\LengthAwarePaginator;

class ProjectContributionService
{
    public function getAllContributions(): LengthAwarePaginator
    {
        return ProjectTeamContribution::with(['project', 'teamMember'])
            ->orderByDesc('created_at')
            ->paginate(15);
    }

    public function createContribution(array $data): ProjectTeamContribution
    {
        return ProjectTeamContribution::create($data)->load(['project', 'teamMember']);
    }

    public function updateContribution(ProjectTeamContribution $contribution, array $data): ProjectTeamContribution
    {
        $contribution->update($data);
        return $contribution->load(['project', 'teamMember']);
    }

    public function deleteContribution(ProjectTeamContribution $contribution): void
    {
        $contribution->delete();
    }
}
