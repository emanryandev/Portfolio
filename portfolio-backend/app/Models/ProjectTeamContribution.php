<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectTeamContribution extends Model
{
    use HasFactory;

    protected $fillable = ['project_id', 'team_member_id', 'role', 'contribution_description'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function teamMember()
    {
        return $this->belongsTo(TeamMember::class);
    }
}
