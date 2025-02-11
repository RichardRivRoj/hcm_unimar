<?php

namespace Database\Seeders;

use App\Models\EmploymentTypes;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmploymentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employmentTypes = [
            ['name' => 'Tiempo completo', 'short_name' => 'TC', 'description' => 'El empleado trabaja la jornada completa.'],
            ['name' => 'Medio tiempo', 'short_name' => 'MT', 'description' => 'El empleado trabaja menos horas que la jornada completa.'],
            ['name' => 'Freelance', 'short_name' => 'FL', 'description' => 'El empleado es independiente y trabaja por proyecto.'],
            ['name' => 'Por horas', 'short_name' => 'PH', 'description' => 'El empleado trabaja horas específicas sin un horario fijo.'],
            ['name' => 'Temporal', 'short_name' => 'T', 'description' => 'El empleado tiene un contrato con duración limitada.'],
            
        ];

        foreach ($employmentTypes as $type) {
            EmploymentTypes::create($type);
        }
    }
}
