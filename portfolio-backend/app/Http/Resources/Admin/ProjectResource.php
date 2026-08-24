<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'status' => $this->status,
            'is_featured' => $this->is_featured,
            'published_at' => $this->published_at,
            'live_url' => $this->live_url,
            'github_url' => $this->github_url,
            'cover_image' => $this->cover_image,
            'order' => $this->order,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            // Only load technologies if requested or naturally loaded
            'technologies' => $this->whenLoaded('technologies', function() {
                return $this->technologies->map(function($tech) {
                    return [
                        'id' => $tech->id,
                        'name' => $tech->name
                    ];
                });
            }),
        ];
    }
}
