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
        Schema::create('persons', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 200);
            $table->string('last_name', 200);
            $table->string('email')->unique();
            $table->date('birth_date')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('identification_value', 50)->unique();
            // Claves foraneas
            $table->foreignId('identification_type_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('ethnicity_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('marital_status_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('gender_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('countries_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('status_id')->default(1)->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('persons');
    }
};
