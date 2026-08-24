<?php

namespace Tests\Feature\Admin;

use App\Models\ContactRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactRequestAdminTest extends TestCase
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

    public function test_unauthenticated_cannot_access_admin_contact_requests()
    {
        $response = $this->spaAdminRequest()->getJson('/api/admin/contact-requests');
        $response->assertStatus(401);
    }

    public function test_admin_can_list_contact_requests()
    {
        $admin = User::factory()->create();
        ContactRequest::create([
            'name' => 'Alice',
            'email' => 'alice@test.com',
            'message' => 'Hello',
        ]);
        ContactRequest::create([
            'name' => 'Bob',
            'email' => 'bob@test.com',
            'message' => 'Hello 2',
        ]);

        $response = $this->spaAdminRequest($admin)->getJson('/api/admin/contact-requests');
        
        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data');
    }

    public function test_admin_can_view_contact_request()
    {
        $admin = User::factory()->create();
        $contact = ContactRequest::create([
            'name' => 'Alice',
            'email' => 'alice@test.com',
            'message' => 'Hello',
        ]);

        $response = $this->spaAdminRequest($admin)->getJson("/api/admin/contact-requests/{$contact->id}");
        
        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'Alice']);
    }

    public function test_admin_cannot_create_contact_request()
    {
        $admin = User::factory()->create();

        $response = $this->spaAdminRequest($admin)->postJson('/api/admin/contact-requests', [
            'name' => 'Eve',
            'email' => 'eve@test.com',
            'message' => 'Hello',
        ]);

        $response->assertStatus(405); // Method not allowed because route not registered
    }

    public function test_admin_can_update_contact_request_status()
    {
        $admin = User::factory()->create();
        $contact = ContactRequest::create([
            'name' => 'Alice',
            'email' => 'alice@test.com',
            'message' => 'Hello',
            'status' => 'new',
        ]);

        $response = $this->spaAdminRequest($admin)->putJson("/api/admin/contact-requests/{$contact->id}", [
            'status' => 'in_progress',
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['status' => 'in_progress']);
        $this->assertDatabaseHas('contact_requests', ['id' => $contact->id, 'status' => 'in_progress']);
    }

    public function test_update_contact_request_status_validation_fails()
    {
        $admin = User::factory()->create();
        $contact = ContactRequest::create([
            'name' => 'Alice',
            'email' => 'alice@test.com',
            'message' => 'Hello',
        ]);

        $response = $this->spaAdminRequest($admin)->putJson("/api/admin/contact-requests/{$contact->id}", [
            'status' => 'invalid_status', // Invalid status
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['status']);
    }

    public function test_admin_can_delete_contact_request()
    {
        $admin = User::factory()->create();
        $contact = ContactRequest::create([
            'name' => 'Alice',
            'email' => 'alice@test.com',
            'message' => 'Hello',
        ]);

        $response = $this->spaAdminRequest($admin)->deleteJson("/api/admin/contact-requests/{$contact->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('contact_requests', ['id' => $contact->id]);
    }
}
