<?php

namespace Tests\Feature;

use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_fetch_all_services()
    {
        Service::factory()->count(3)->create();

        $response = $this->getJson('/api/services');

        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
    }

    public function test_public_can_fetch_service_by_slug()
    {
        Service::factory()->create(['slug' => 'web-dev', 'name' => 'Web Development']);

        $response = $this->getJson('/api/services/web-dev');

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'Web Development']);
    }
}
