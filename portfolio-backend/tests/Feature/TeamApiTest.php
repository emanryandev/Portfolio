<?php

namespace Tests\Feature;

use App\Models\TeamMember;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeamApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_fetch_all_team_members()
    {
        TeamMember::factory()->count(3)->create();

        $response = $this->getJson('/api/team');

        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
    }

    public function test_public_can_fetch_member_by_slug()
    {
        TeamMember::factory()->create(['slug' => 'john-doe', 'name' => 'John Doe']);

        $response = $this->getJson('/api/team/john-doe');

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'John Doe']);
    }
}
