<?php

namespace App\Policies;

use App\Models\ProjectTeamContribution;
use App\Models\User;

class ProjectTeamContributionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, ProjectTeamContribution $projectTeamContribution): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, ProjectTeamContribution $projectTeamContribution): bool
    {
        return true;
    }

    public function delete(User $user, ProjectTeamContribution $projectTeamContribution): bool
    {
        return true;
    }
}
