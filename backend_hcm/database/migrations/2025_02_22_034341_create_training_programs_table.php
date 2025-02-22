<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('training_programs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('content')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->integer('limit')->nullable();
            $table->foreignId('visibility_id')->constrained('program_visibilities')->onDelete('cascade');
            $table->foreignId('status_id')->constrained('completion_statuses')->onDelete('cascade');
            $table->foreignId('training_type_id')->constrained('training_types')->onDelete('cascade');
            $table->foreignId('modality_id')->constrained('training_modalities')->onDelete('cascade');
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_programs');
    }
};
