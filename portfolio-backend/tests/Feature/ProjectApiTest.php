<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_fetch_published_projects()
    {
        // Published
        Project::factory()->create(['status' => 'completed', 'published_at' => now(), 'name' => 'Project A', 'order' => 1]);
        // Unpublished
        Project::factory()->create(['status' => 'draft', 'published_at' => null, 'name' => 'Project B']);

        $response = $this->getJson('/api/projects');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonFragment(['name' => 'Project A']);
    }

    public function test_public_can_fetch_featured_projects()
    {
        Project::factory()->create(['status' => 'completed', 'published_at' => now(), 'is_featured' => true, 'name' => 'Featured Proj']);
        Project::factory()->create(['status' => 'completed', 'published_at' => now(), 'is_featured' => false, 'name' => 'Normal Proj']);

        $response = $this->getJson('/api/projects/featured');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonFragment(['name' => 'Featured Proj']);
    }

    public function test_public_can_fetch_single_project_by_slug()
    {
        $project = Project::factory()->create(['slug' => 'test-project', 'name' => 'Test Project']);

        $response = $this->getJson('/api/projects/test-project');

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'Test Project']);
    }

    public function test_fetching_nonexistent_project_returns_404()
    {
        $response = $this->getJson('/api/projects/not-found');

        $response->assertStatus(404);
    }
}
