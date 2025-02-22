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
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->string('description', 100);
            $table->integer('code');
            $table->text('mission')->nullable();
            $table->text('vision')->nullable();
            $table->json('responsibilities')->nullable(); // Almacenar como lista en JSON
            $table->json('objectives')->nullable(); // Almacenar como lista en JSON
            $table->string('contact_info', 50)->nullable(); // Datos de contacto del departamento
            $table->string('file_path')->nullable(); // Imagen del departamento
            $table->json('extra_data')->nullable(); // Para información adicional futura
            $table->foreignId('status_id')->nullable()->constrained('statuses')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
