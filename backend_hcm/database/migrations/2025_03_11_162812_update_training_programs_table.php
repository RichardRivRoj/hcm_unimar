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
        Schema::table('training_programs', function (Blueprint $table) {
            // Si existía una relación con 'performance_evaluations', la eliminamos
            if (Schema::hasColumn('training_programs', 'department_id')) {
                $table->dropForeign(['department_id']);
                $table->dropColumn('department_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('training_programs', function (Blueprint $table) {
            // Si necesitas revertir el cambio, puedes volver a agregar la columna
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
        });
    }
};
