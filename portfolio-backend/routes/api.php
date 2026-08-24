<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ContactController;

// ---------------------------------------------------------
// PUBLIC ROUTES
// ---------------------------------------------------------

// Auth
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

// Team
Route::get('/team', [TeamController::class, 'index']);
Route::get('/team/{slug}', [TeamController::class, 'show']);

// Projects
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/featured', [ProjectController::class, 'featured']);
Route::get('/projects/{slug}', [ProjectController::class, 'show']);

// Services
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{slug}', [ServiceController::class, 'show']);

// Contact
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:contact');


// ---------------------------------------------------------
// PROTECTED ROUTES (Admin)
// ---------------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    // Admin endpoints will be registered here in Phase 3
    Route::get('admin/dashboard/summary', [\App\Http\Controllers\Admin\DashboardController::class, 'summary']);
    Route::apiResource('admin/team-members', \App\Http\Controllers\Admin\TeamMemberController::class);
    Route::apiResource('admin/projects', \App\Http\Controllers\Admin\ProjectController::class);
    Route::apiResource('admin/project-contributions', \App\Http\Controllers\Admin\ProjectContributionController::class)
         ->parameters(['project-contributions' => 'contribution']);
    Route::apiResource('admin/services', \App\Http\Controllers\Admin\ServiceController::class);
    Route::apiResource('admin/contact-requests', \App\Http\Controllers\Admin\ContactRequestController::class)
         ->except(['store', 'create']); // Admins cannot create
    Route::post('admin/upload', [\App\Http\Controllers\Admin\FileUploadController::class, 'store']);
});
