<?php

namespace Database\Seeders;

use App\Models\Position;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        $positions = [
            ['Gerente General', 1001],
            ['Director de Operaciones', 1002],
            ['Jefe de Departamento', 1003],
            ['Supervisor de Producción', 1004],
            ['Coordinador de Logística', 1005],
            ['Analista Financiero', 1006],
            ['Especialista en RH', 1007],
            ['Ingeniero de Proyectos', 1008],
            ['Desarrollador Senior', 1009],
            ['Diseñador UX/UI', 1010],
            ['Contador General', 1011],
            ['Auditor Interno', 1012],
            ['Ejecutivo de Ventas', 1013],
            ['Asistente Administrativo', 1014],
            ['Técnico de Mantenimiento', 1015],
            ['Investigador Científico', 1016],
            ['Especialista en Marketing', 1017],
            ['Coordinador de Calidad', 1018],
            ['Analista de Datos', 1019],
            ['Archivista Documental', 1020]
        ];

        foreach ($positions as $position) {
            Position::create([
                'description' => $position[0],
                'code' => $position[1],
                'level_id' => $faker->numberBetween(1, 10), // Niveles del 1 al 10
                'status_id' => 1 // Asumiendo que 1 = Activo
            ]);
        }
    }
}
