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
               // Eliminar la clave foránea incorrecta
               $table->dropForeign(['status_id']);

               // Opcional: Eliminar la columna si deseas recrearla
               $table->dropColumn('status_id');
   
               // Crear la nueva relación correcta
               $table->foreignId('status_id')->constrained('statuses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('training_programs', function (Blueprint $table) {
            // Revertir los cambios en caso de rollback
            $table->dropForeign(['status_id']);
            $table->dropColumn('status_id');
            $table->foreignId('status_id')->constrained('completion_statuses')->onDelete('cascade');
        });
    }
};
