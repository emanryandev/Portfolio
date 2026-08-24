<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FileUploadRequest;
use App\Services\Upload\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class FileUploadController extends Controller
{
    protected FileUploadService $uploadService;

    public function __construct(FileUploadService $uploadService)
    {
        $this->uploadService = $uploadService;
    }

    public function store(FileUploadRequest $request): JsonResponse
    {
        // Simple manual auth check, as we don't have a specific model for uploads yet.
        // Assuming all authenticated users can upload files for now.
        // In a real app we might have a FilePolicy or similar.
        
        $folder = $request->validated('folder') ?? 'general';
        $url = $this->uploadService->uploadFile($request->file('file'), $folder);

        return response()->json([
            'message' => 'File uploaded successfully',
            'url' => $url,
        ], 201);
    }
}
