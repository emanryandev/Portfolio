<?php

namespace Tests\Feature\Admin;

use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceAdminTest extends TestCase
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

    public function test_unauthenticated_cannot_access_admin_services()
    {
        $response = $this->spaAdminRequest()->getJson('/api/admin/services');
        $response->assertStatus(401);
    }

    public function test_admin_can_list_services()
    {
        $admin = User::factory()->create();
        Service::factory()->count(2)->create();

        $response = $this->spaAdminRequest($admin)->getJson('/api/admin/services');
        
        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data');
    }

    public function test_admin_can_create_service_with_features()
    {
        $admin = User::factory()->create();

        $response = $this->spaAdminRequest($admin)->postJson('/api/admin/services', [
            'name' => 'Web Design',
            'slug' => 'web-design',
            'description' => 'Great web design',
            'price_type' => 'fixed',
            'price' => 500,
            'features' => [
                ['feature_name' => 'Responsive', 'order' => 1],
                ['feature_name' => 'Fast', 'order' => 2],
            ]
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('services', ['slug' => 'web-design']);
        $this->assertDatabaseHas('service_features', ['feature_name' => 'Responsive']);
        $this->assertDatabaseHas('service_features', ['feature_name' => 'Fast']);
    }

    public function test_create_service_validation_fails()
    {
        $admin = User::factory()->create();

        $response = $this->spaAdminRequest($admin)->postJson('/api/admin/services', [
            'name' => '', // required
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'slug', 'description', 'price_type']);
    }

    public function test_admin_can_update_service()
    {
        $admin = User::factory()->create();
        $service = Service::factory()->create(['name' => 'Old Name', 'slug' => 'old-slug', 'price_type' => 'fixed']);

        $response = $this->spaAdminRequest($admin)->putJson("/api/admin/services/{$service->id}", [
            'name' => 'New Name',
            'slug' => 'old-slug', 
            'description' => 'Updated desc',
            'price_type' => 'hourly'
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'New Name']);
        $this->assertDatabaseHas('services', ['name' => 'New Name', 'price_type' => 'hourly']);
    }

    public function test_admin_can_delete_service()
    {
        $admin = User::factory()->create();
        $service = Service::factory()->create();

        $response = $this->spaAdminRequest($admin)->deleteJson("/api/admin/services/{$service->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('services', ['id' => $service->id]);
    }
}
