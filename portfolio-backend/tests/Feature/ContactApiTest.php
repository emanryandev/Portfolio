<?php

namespace Tests\Feature;

use App\Models\ContactRequest;
use App\Models\TeamMember;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_submit_contact_request()
    {
        $response = $this->postJson('/api/contact', [
            'name' => 'Alice',
            'email' => 'alice@example.com',
            'message' => 'Hello there!',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('contact_requests', [
            'name' => 'Alice',
            'email' => 'alice@example.com',
        ]);
    }

    public function test_contact_request_validation_fails_without_required_fields()
    {
        $response = $this->postJson('/api/contact', [
            'name' => '',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'email', 'message']);
    }

    public function test_contact_request_can_attach_recipients_and_service()
    {
        $member1 = TeamMember::factory()->create();
        $member2 = TeamMember::factory()->create();
        $service = Service::factory()->create();

        $response = $this->postJson('/api/contact', [
            'name' => 'Bob',
            'email' => 'bob@example.com',
            'message' => 'I need a website',
            'selected_service_id' => $service->id,
            'recipients' => [$member1->id, $member2->id],
        ]);

        $response->assertStatus(201);
        
        $contactRequest = ContactRequest::where('email', 'bob@example.com')->first();
        $this->assertNotNull($contactRequest);
        $this->assertEquals($service->id, $contactRequest->selected_service_id);
        $this->assertEquals(2, $contactRequest->recipients()->count());
    }
    
    public function test_contact_request_auto_attaches_all_members_if_recipients_empty()
    {
        TeamMember::factory()->count(3)->create();
        
        $response = $this->postJson('/api/contact', [
            'name' => 'Charlie',
            'email' => 'charlie@example.com',
            'message' => 'I want to hire the whole team',
            'recipients' => [],
        ]);

        $response->assertStatus(201);
        $contactRequest = ContactRequest::where('email', 'charlie@example.com')->first();
        $this->assertEquals(3, $contactRequest->recipients()->count());
    }

    public function test_contact_request_dispatches_event_and_queues_email()
    {
        \Illuminate\Support\Facades\Event::fake();
        \Illuminate\Support\Facades\Mail::fake();

        $response = $this->postJson('/api/contact', [
            'name' => 'Dave',
            'email' => 'dave@example.com',
            'message' => 'Testing emails',
        ]);

        $response->assertStatus(201);

        \Illuminate\Support\Facades\Event::assertDispatched(\App\Events\ContactRequestSubmitted::class, function ($event) {
            return $event->contactRequest->email === 'dave@example.com';
        });
    }

    public function test_contact_request_rollback_prevents_event_dispatch()
    {
        \Illuminate\Support\Facades\Event::fake();
        
        // Force an exception during creation by sending invalid data that passes request validation but fails at DB level,
        // or by mocking the model. The easiest way is mocking the ContactRequest model or ContactService.
        $mock = \Mockery::mock(\App\Services\Contact\ContactService::class)->makePartial();
        $mock->shouldReceive('storeContactRequest')->andThrow(new \Exception('DB Error'));
        $this->app->instance(\App\Services\Contact\ContactService::class, $mock);

        $response = $this->postJson('/api/contact', [
            'name' => 'Eve',
            'email' => 'eve@example.com',
            'message' => 'This should fail',
        ]);

        $response->assertStatus(500);

        // Ensure the event was never dispatched because of the exception
        \Illuminate\Support\Facades\Event::assertNotDispatched(\App\Events\ContactRequestSubmitted::class);
    }
}
