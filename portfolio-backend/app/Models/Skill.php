<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'icon'];

    public function teamMembers()
    {
        return $this->belongsToMany(TeamMember::class, 'team_member_skills');
    }
}
