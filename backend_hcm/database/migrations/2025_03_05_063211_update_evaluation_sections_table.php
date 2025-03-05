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
        Schema::table('evaluation_sections', function (Blueprint $table) {
            // Si existía una relación con 'performance_evaluations', la eliminamos
            if (Schema::hasColumn('evaluation_sections', 'evaluation_id')) {
                $table->dropForeign(['evaluation_id']);
                $table->dropColumn('evaluation_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('evaluation_sections', function (Blueprint $table) {
            // Si necesitas revertir el cambio, puedes volver a agregar la columna
            $table->foreignId('evaluation_id')->constrained()->onDelete('cascade');
        });
    }
};
