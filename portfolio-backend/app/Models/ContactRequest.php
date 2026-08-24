<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'email', 'phone', 'subject', 'message', 
        'selected_service_id', 'project_type', 'budget', 'status'
    ];

    public function service()
    {
        return $this->belongsTo(Service::class, 'selected_service_id');
    }

    public function recipients()
    {
        return $this->belongsToMany(TeamMember::class, 'contact_request_recipients');
    }
}
