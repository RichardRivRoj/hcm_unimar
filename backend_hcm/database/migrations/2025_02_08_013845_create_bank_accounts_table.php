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
        Schema::create('bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('account_number', 30)->unique();
            $table->foreignId('bank_id')->constrained('banks')->onDelete('cascade');
            $table->foreignId('account_type_id')->constrained('account_types')->onDelete('cascade');
            $table->foreignId('currency_id')->constrained('currencies')->onDelete('cascade');
            $table->foreignId('person_id')->constrained('persons')->onDelete('cascade');
            $table->foreignId('status_id')->default(1)->constrained('statuses')->onDelete('cascade');
            $table->timestamps();

            // Restricción única: misma cuenta no puede repetirse en un banco
            $table->unique(['bank_id', 'account_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_accounts');
    }
};
