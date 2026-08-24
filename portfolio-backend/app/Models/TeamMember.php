<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'role', 'bio', 'image_url', 'email', 'order'];

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'team_member_skills');
    }

    public function socialLinks()
    {
        return $this->hasMany(SocialLink::class);
    }

    public function projectContributions()
    {
        return $this->hasMany(ProjectTeamContribution::class);
    }
}
