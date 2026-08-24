<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price_type' => $this->price_type,
            'price' => $this->price,
            'is_featured' => $this->is_featured,
            'order' => $this->order,
            'features' => $this->whenLoaded('features', function() {
                return $this->features->map(function($feature) {
                    return [
                        'id' => $feature->id,
                        'feature_name' => $feature->feature_name,
                        'order' => $feature->order,
                    ];
                });
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
