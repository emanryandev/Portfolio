<?php

namespace Tests\Feature\Admin;

use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeamMemberAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function spaAdminRequest(User $user = null)
    {
        $request = $this->withHeaders(['referer' => 'http://localhost:5173']);
        if ($user) {
            $request = $request->actingAs($user);
        }
        return $request;
    }

    public function test_unauthenticated_cannot_access_admin_team_members()
    {
        $response = $this->spaAdminRequest()->getJson('/api/admin/team-members');
        $response->assertStatus(401);
    }

    public function test_admin_can_list_team_members()
    {
        $admin = User::factory()->create();
        TeamMember::factory()->count(2)->create();

        $response = $this->spaAdminRequest($admin)->getJson('/api/admin/team-members');
        
        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data');
    }

    public function test_admin_can_create_team_member()
    {
        $admin = User::factory()->create();

        $response = $this->spaAdminRequest($admin)->postJson('/api/admin/team-members', [
            'name' => 'New Dev',
            'slug' => 'new-dev',
            'role' => 'Backend',
            'bio' => 'Loves Laravel',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('team_members', ['slug' => 'new-dev']);
    }

    public function test_create_team_member_validation_fails()
    {
        $admin = User::factory()->create();

        $response = $this->spaAdminRequest($admin)->postJson('/api/admin/team-members', [
            'name' => '', // required
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'slug', 'role', 'bio']);
    }

    public function test_admin_can_update_team_member()
    {
        $admin = User::factory()->create();
        $member = TeamMember::factory()->create(['name' => 'Old Name', 'slug' => 'old-slug']);

        $response = $this->spaAdminRequest($admin)->putJson("/api/admin/team-members/{$member->id}", [
            'name' => 'New Name',
            'slug' => 'old-slug', // Same slug
            'role' => 'Backend',
            'bio' => 'Updated bio',
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'New Name']);
        $this->assertDatabaseHas('team_members', ['name' => 'New Name']);
    }

    public function test_admin_can_delete_team_member()
    {
        $admin = User::factory()->create();
        $member = TeamMember::factory()->create();

        $response = $this->spaAdminRequest($admin)->deleteJson("/api/admin/team-members/{$member->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('team_members', ['id' => $member->id]);
    }

    public function test_cannot_update_nonexistent_team_member()
    {
        $admin = User::factory()->create();

        $response = $this->spaAdminRequest($admin)->putJson("/api/admin/team-members/9999", [
            'name' => 'New Name',
            'slug' => 'new-slug',
            'role' => 'Backend',
            'bio' => 'Updated bio',
        ]);

        $response->assertStatus(404);
    }
}
