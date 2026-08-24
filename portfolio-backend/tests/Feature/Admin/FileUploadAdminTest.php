<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileUploadAdminTest extends TestCase
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

    public function test_unauthenticated_cannot_upload_file()
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->image('avatar.jpg');

        $response = $this->spaAdminRequest()->postJson('/api/admin/upload', [
            'file' => $file,
            'folder' => 'team'
        ]);

        $response->assertStatus(401);
    }

    public function test_admin_can_upload_image()
    {
        $admin = User::factory()->create();
        Storage::fake('public');

        $file = UploadedFile::fake()->image('avatar.jpg', 100, 100);

        $response = $this->spaAdminRequest($admin)->postJson('/api/admin/upload', [
            'file' => $file,
            'folder' => 'team'
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['message', 'url']);

        // Assert file was saved...
        $url = $response->json('url');
        $this->assertStringContainsString('uploads/team/', $url);
        
        // Assert the file exists on the disk
        $path = str_replace(Storage::disk('public')->url(''), '', $url);
        Storage::disk('public')->assertExists($path);
    }

    public function test_upload_validation_fails_for_non_image()
    {
        $admin = User::factory()->create();
        Storage::fake('public');

        // Create a fake PDF
        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $response = $this->spaAdminRequest($admin)->postJson('/api/admin/upload', [
            'file' => $file,
            'folder' => 'team'
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['file']);
    }

    public function test_upload_validation_fails_for_large_file()
    {
        $admin = User::factory()->create();
        Storage::fake('public');

        // Over 5MB (e.g. 6MB = 6144KB)
        $file = UploadedFile::fake()->create('large.jpg', 6144, 'image/jpeg');

        $response = $this->spaAdminRequest($admin)->postJson('/api/admin/upload', [
            'file' => $file,
            'folder' => 'team'
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['file']);
    }

    public function test_upload_validation_fails_for_invalid_folder()
    {
        $admin = User::factory()->create();
        Storage::fake('public');

        $file = UploadedFile::fake()->image('avatar.jpg');

        $response = $this->spaAdminRequest($admin)->postJson('/api/admin/upload', [
            'file' => $file,
            'folder' => 'invalid_folder'
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['folder']);
    }
}
