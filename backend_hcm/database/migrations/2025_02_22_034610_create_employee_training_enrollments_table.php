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
        Schema::create('employee_training_enrollments', function (Blueprint $table) {
            $table->id();
            $table->date('enrollment_date');
            $table->decimal('score', 5, 2)->nullable();
            $table->decimal('attendance_rate', 5, 2)->nullable();
            $table->boolean('assigned_by_admin')->default(false);
            $table->foreignId('completion_status_id')->constrained('completion_statuses')->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('training_program_id')->constrained('training_programs')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_training_enrollments');
    }
};
