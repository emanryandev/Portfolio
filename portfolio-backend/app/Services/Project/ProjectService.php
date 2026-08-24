<?php

namespace App\Services\Project;

use App\Models\Project;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Log;

class ProjectService
{
    /**
     * Get published projects for the public listing.
     */
    public function getPublishedProjects(int $perPage = 10): LengthAwarePaginator
    {
        return Project::with(['category', 'technologies'])
            ->whereIn('status', ['completed', 'in_progress'])
            ->whereNotNull('published_at')
            ->orderBy('order')
            ->orderByDesc('published_at')
            ->paginate($perPage);
    }

    /**
     * Get featured published projects.
     */
    public function getFeaturedProjects(int $limit = 4): Collection
    {
        return Project::with(['category', 'technologies'])
            ->where('is_featured', true)
            ->whereIn('status', ['completed', 'in_progress'])
            ->whereNotNull('published_at')
            ->orderBy('order')
            ->orderByDesc('published_at')
            ->limit($limit)
            ->get();
    }

    /**
     * Retrieve a project by its slug with all relationships loaded.
     */
    public function getProjectBySlug(string $slug): Project
    {
        return Project::with([
            'category', 
            'technologies', 
            'images', 
            'teamContributions.teamMember'
        ])->where('slug', $slug)->firstOrFail();
    }

    // ----------------------------------------------------
    // Admin CRUD Methods
    // ----------------------------------------------------

    public function getAllProjectsAdmin(): LengthAwarePaginator
    {
        return Project::with(['category', 'technologies'])
            ->orderByDesc('created_at')
            ->paginate(15);
    }

    public function createProject(array $data): Project
    {
        DB::beginTransaction();
        try {
            $technologies = $data['technologies'] ?? [];
            unset($data['technologies']);

            $project = Project::create($data);

            if (!empty($technologies)) {
                $project->technologies()->sync($technologies);
            }

            DB::commit();
            return $project->load('technologies');
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to create project: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updateProject(Project $project, array $data): Project
    {
        DB::beginTransaction();
        try {
            $technologies = $data['technologies'] ?? null;
            unset($data['technologies']);

            $project->update($data);

            // Only sync if the key was present in the request
            if ($technologies !== null) {
                $project->technologies()->sync($technologies);
            }

            DB::commit();
            return $project->load('technologies');
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to update project: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteProject(Project $project): void
    {
        DB::beginTransaction();
        try {
            // Delete related project contributions directly to be safe, 
            // though database cascade usually handles it.
            // But we might have other logic.
            $project->technologies()->detach();
            $project->delete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete project: ' . $e->getMessage());
            throw $e;
        }
    }
}
