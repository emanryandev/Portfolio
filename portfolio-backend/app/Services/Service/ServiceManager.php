<?php

namespace App\Services\Service;

use App\Models\Service;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Log;

class ServiceManager
{
    public function getAllServices(): Collection
    {
        return Service::with('features')
            ->orderBy('order')
            ->get();
    }

    public function getServiceBySlug(string $slug): Service
    {
        return Service::with('features')
            ->where('slug', $slug)
            ->firstOrFail();
    }

    // ----------------------------------------------------
    // Admin CRUD Methods
    // ----------------------------------------------------

    public function createService(array $data): Service
    {
        DB::beginTransaction();
        try {
            $features = $data['features'] ?? [];
            unset($data['features']);

            $service = Service::create($data);

            if (!empty($features)) {
                foreach ($features as $feature) {
                    $service->features()->create($feature);
                }
            }

            DB::commit();
            return $service->load('features');
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to create service: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updateService(Service $service, array $data): Service
    {
        DB::beginTransaction();
        try {
            $features = $data['features'] ?? null;
            unset($data['features']);

            $service->update($data);

            if ($features !== null) {
                // Simplest approach: delete old features, insert new ones
                $service->features()->delete();
                foreach ($features as $feature) {
                    $service->features()->create($feature);
                }
            }

            DB::commit();
            return $service->load('features');
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to update service: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteService(Service $service): void
    {
        DB::beginTransaction();
        try {
            $service->features()->delete();
            $service->delete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete service: ' . $e->getMessage());
            throw $e;
        }
    }
}
