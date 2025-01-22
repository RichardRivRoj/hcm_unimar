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
        Schema::create('job_positions', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100); // Nombre del puesto
            $table->text('description')->nullable(); // Descripcion del puesto
            $table->integer('vacancies')->default(1); // Cantidad de vacantes
            $table->foreignId('department_id')->constrained()->cascadeOnDelete(); // Relacion con el departamento
            $table->string('location', 150)->nullable(); // Ubicacion del puesto
            $table->text('requirements')->nullable(); // Requisitos del puesto
            $table->boolean('remote')->default(false); // Trabajo Remoto (checkbox)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_positions');
    }
};
