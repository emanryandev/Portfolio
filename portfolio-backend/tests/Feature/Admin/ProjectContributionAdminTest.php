<?php

namespace Tests\Feature\Admin;

use App\Models\Project;
use App\Models\ProjectTeamContribution;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectContributionAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function spaAdminRequest(?User $user = null)
    {
        $request = $this->withHeaders(['referer' => 'http://localhost:5173']);
        if ($user) {
            $request = $request->actingAs($user);
        }
        return $request;
    }

    public function test_admin_can_list_contributions()
    {
        $admin = User::factory()->create();
        $project = Project::factory()->create();
        $member = TeamMember::factory()->create();
        ProjectTeamContribution::create([
            'project_id' => $project->id,
            'team_member_id' => $member->id,
            'role' => 'Developer',
            'contribution_description' => 'Did stuff',
        ]);

        $response = $this->spaAdminRequest($admin)->getJson('/api/admin/project-contributions');
        
        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data');
    }

    public function test_admin_can_create_contribution()
    {
        $admin = User::factory()->create();
        $project = Project::factory()->create();
        $member = TeamMember::factory()->create();

        $response = $this->spaAdminRequest($admin)->postJson('/api/admin/project-contributions', [
            'project_id' => $project->id,
            'team_member_id' => $member->id,
            'role' => 'Lead Developer',
            'contribution_description' => 'Did everything',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('project_team_contributions', [
            'project_id' => $project->id,
            'team_member_id' => $member->id,
            'role' => 'Lead Developer',
        ]);
    }

    public function test_admin_cannot_create_duplicate_contribution_for_same_member_and_project()
    {
        $admin = User::factory()->create();
        $project = Project::factory()->create();
        $member = TeamMember::factory()->create();
        ProjectTeamContribution::create([
            'project_id' => $project->id,
            'team_member_id' => $member->id,
            'role' => 'Developer',
            'contribution_description' => 'Did stuff',
        ]);

        $response = $this->spaAdminRequest($admin)->postJson('/api/admin/project-contributions', [
            'project_id' => $project->id,
            'team_member_id' => $member->id,
            'role' => 'Designer',
            'contribution_description' => 'Designed stuff',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['team_member_id']);
    }

    public function test_admin_can_update_contribution()
    {
        $admin = User::factory()->create();
        $project = Project::factory()->create();
        $member = TeamMember::factory()->create();
        $contribution = ProjectTeamContribution::create([
            'project_id' => $project->id,
            'team_member_id' => $member->id,
            'role' => 'Developer',
            'contribution_description' => 'Did stuff',
        ]);

        $response = $this->spaAdminRequest($admin)->putJson("/api/admin/project-contributions/{$contribution->id}", [
            'project_id' => $project->id,
            'team_member_id' => $member->id, // Same member is allowed on update
            'role' => 'Senior Developer',
            'contribution_description' => 'Updated stuff',
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['role' => 'Senior Developer']);
    }

    public function test_admin_can_delete_contribution()
    {
        $admin = User::factory()->create();
        $project = Project::factory()->create();
        $member = TeamMember::factory()->create();
        $contribution = ProjectTeamContribution::create([
            'project_id' => $project->id,
            'team_member_id' => $member->id,
            'role' => 'Developer',
            'contribution_description' => 'Did stuff',
        ]);

        $response = $this->spaAdminRequest($admin)->deleteJson("/api/admin/project-contributions/{$contribution->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('project_team_contributions', ['id' => $contribution->id]);
    }
}
