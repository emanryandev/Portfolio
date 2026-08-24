<?php

namespace Tests\Feature\Admin;

use App\Models\Project;
use App\Models\Technology;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectAdminTest extends TestCase
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

    public function test_unauthenticated_cannot_access_admin_projects()
    {
        $response = $this->spaAdminRequest()->getJson('/api/admin/projects');
        $response->assertStatus(401);
    }

    public function test_admin_can_list_projects()
    {
        $admin = User::factory()->create();
        Project::factory()->count(2)->create();

        $response = $this->spaAdminRequest($admin)->getJson('/api/admin/projects');
        
        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data');
    }

    public function test_admin_can_create_project_with_technologies()
    {
        $admin = User::factory()->create();
        $tech = Technology::create(['name' => 'Laravel', 'slug' => 'laravel']);

        $response = $this->spaAdminRequest($admin)->postJson('/api/admin/projects', [
            'name' => 'New Project',
            'slug' => 'new-project',
            'description' => 'A great project',
            'status' => 'draft',
            'technologies' => [$tech->id]
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('projects', ['slug' => 'new-project']);
        $this->assertDatabaseHas('project_technologies', [
            'technology_id' => $tech->id
        ]);
    }

    public function test_create_project_validation_fails()
    {
        $admin = User::factory()->create();

        $response = $this->spaAdminRequest($admin)->postJson('/api/admin/projects', [
            'name' => '', // required
            'status' => 'invalid_status'
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'slug', 'description', 'status']);
    }

    public function test_admin_can_update_project()
    {
        $admin = User::factory()->create();
        $project = Project::factory()->create(['name' => 'Old Name', 'slug' => 'old-slug', 'status' => 'draft']);

        $response = $this->spaAdminRequest($admin)->putJson("/api/admin/projects/{$project->id}", [
            'name' => 'New Name',
            'slug' => 'old-slug', 
            'description' => 'Updated desc',
            'status' => 'in_progress'
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'New Name']);
        $this->assertDatabaseHas('projects', ['name' => 'New Name', 'status' => 'in_progress']);
    }

    public function test_admin_can_delete_project()
    {
        $admin = User::factory()->create();
        $project = Project::factory()->create();

        $response = $this->spaAdminRequest($admin)->deleteJson("/api/admin/projects/{$project->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }
}
