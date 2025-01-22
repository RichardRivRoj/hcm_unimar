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
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->onDelete('cascade'); // Relacion con el candidato
            $table->foreignId('job_position_id')->constrained()->onDelete('cascade'); // Relacion con el puesto
            $table->enum('status', ['pending', 'interview', 'evaluation', 'hired', 'rejected'])->default('pending'); // Estado del proceso
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
