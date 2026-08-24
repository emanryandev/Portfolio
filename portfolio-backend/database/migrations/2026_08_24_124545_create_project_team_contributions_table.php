<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_team_contributions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_member_id')->constrained()->cascadeOnDelete();
            $table->string('role');
            $table->text('contribution_description');
            $table->timestamps();
            
            // Allow a member to have multiple contributions per project, but usually we just keep it unique per member+project.
            // Let's not enforce uniqueness to allow flexibility if they held multiple roles sequentially.
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_team_contributions');
    }
};
