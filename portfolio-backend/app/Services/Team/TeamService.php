<?php

namespace App\Services\Team;

use App\Models\TeamMember;
use Illuminate\Database\Eloquent\Collection;

class TeamService
{
    public function getAllActiveMembers(): Collection
    {
        return TeamMember::with(['skills', 'socialLinks'])
            ->orderBy('order')
            ->get();
    }

    public function getMemberBySlug(string $slug): ?TeamMember
    {
        return TeamMember::with(['skills', 'socialLinks', 'projectContributions.project'])
            ->where('slug', $slug)
            ->firstOrFail();
    }

    /**
     * Get all members for Admin (including inactive if there were any statuses)
     */
    public function getAllMembersAdmin(): Collection
    {
        return TeamMember::orderBy('order')->get();
    }

    public function createMember(array $data): TeamMember
    {
        return TeamMember::create($data);
    }

    public function updateMember(TeamMember $member, array $data): TeamMember
    {
        $member->update($data);
        return $member;
    }

    public function deleteMember(TeamMember $member): void
    {
        $member->delete();
    }
}
