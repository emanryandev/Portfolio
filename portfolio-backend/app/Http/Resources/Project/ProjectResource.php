<?php

namespace App\Http\Resources\Project;

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
            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->id,
                    'name' => $this->category->name,
                    'slug' => $this->category->slug,
                ];
            }),
            'status' => $this->status,
            'is_featured' => $this->is_featured,
            'published_at' => $this->published_at,
            'live_url' => $this->live_url,
            'github_url' => $this->github_url,
            'cover_image' => $this->cover_image,
            'order' => $this->order,
            'technologies' => $this->whenLoaded('technologies'),
            'images' => $this->whenLoaded('images'),
            'team_contributions' => clone $this->whenLoaded('teamContributions', function () {
                return $this->teamContributions->map(function ($contribution) {
                    return [
                        'id' => $contribution->id,
                        'role' => $contribution->role,
                        'description' => $contribution->contribution_description,
                        'member' => [
                            'id' => $contribution->teamMember->id ?? null,
                            'name' => $contribution->teamMember->name ?? null,
                            'slug' => $contribution->teamMember->slug ?? null,
                            'image_url' => $contribution->teamMember->image_url ?? null,
                        ],
                    ];
                });
            }),
        ];
    }
}
