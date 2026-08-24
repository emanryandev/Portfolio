<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectContributionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'team_member_id' => $this->team_member_id,
            'role' => $this->role,
            'contribution_description' => $this->contribution_description,
            'project' => $this->whenLoaded('project', function() {
                return [
                    'id' => $this->project->id,
                    'name' => $this->project->name,
                ];
            }),
            'team_member' => $this->whenLoaded('teamMember', function() {
                return [
                    'id' => $this->teamMember->id,
                    'name' => $this->teamMember->name,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
