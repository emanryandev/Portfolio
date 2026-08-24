<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'subject' => $this->subject,
            'message' => $this->message,
            'status' => $this->status,
            'project_type' => $this->project_type,
            'budget' => $this->budget,
            'service' => $this->whenLoaded('service', function() {
                return [
                    'id' => $this->service->id,
                    'name' => $this->service->name,
                ];
            }),
            'recipients' => $this->whenLoaded('recipients', function() {
                return $this->recipients->map(function($member) {
                    return [
                        'id' => $member->id,
                        'name' => $member->name,
                    ];
                });
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
