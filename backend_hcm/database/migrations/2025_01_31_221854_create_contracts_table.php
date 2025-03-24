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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('contract_number', 50);
            $table->text('description');
            $table->date('start_date')->default(now());
            $table->date('end_date')->nullable();
            $table->text('notes')->nullable();
            $table->string('file_path', 220)->nullable();
            $table->foreignId('payment_term_id')->constrained('payment_terms')->onDelete('cascade');
            $table->foreignId('contract_type_id')->constrained('contract_types')->onDelete('cascade');
            $table->foreignId('employment_type_id')->constrained('employment_types')->onDelete('cascade');
            $table->foreignId('position_id')->constrained('positions')->onDelete('cascade');
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');
            $table->foreignId('status_id')->nullable()->constrained('statuses')->onDelete('set null');
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
