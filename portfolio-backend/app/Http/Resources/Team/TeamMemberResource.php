<?php

namespace App\Http\Resources\Team;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'role' => $this->role,
            'bio' => $this->bio,
            'image_url' => $this->image_url,
            'email' => $this->email,
            'order' => $this->order,
            'skills' => $this->whenLoaded('skills'),
            'social_links' => $this->whenLoaded('socialLinks'),
        ];
    }
}
