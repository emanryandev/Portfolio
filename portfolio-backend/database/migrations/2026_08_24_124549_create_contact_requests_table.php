<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('subject')->nullable();
            $table->text('message');
            $table->foreignId('selected_service_id')->nullable()->constrained('services')->nullOnDelete();
            $table->string('project_type')->nullable();
            $table->string('budget')->nullable();
            $table->enum('status', ['new', 'in_progress', 'contacted', 'converted', 'closed', 'spam'])->default('new');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_requests');
    }
};
