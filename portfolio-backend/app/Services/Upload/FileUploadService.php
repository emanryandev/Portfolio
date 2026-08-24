<?php

namespace App\Services\Upload;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Exception;
use Illuminate\Support\Facades\Log;

class FileUploadService
{
    public function uploadFile(UploadedFile $file, string $folder = 'general'): string
    {
        try {
            // Using 'public' disk so files are accessible via URL
            $path = $file->store("uploads/{$folder}", 'public');
            
            // Return full URL
            return Storage::disk('public')->url($path);
        } catch (Exception $e) {
            Log::error('File upload failed: ' . $e->getMessage());
            throw $e;
        }
    }
}
