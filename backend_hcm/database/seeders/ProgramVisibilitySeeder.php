<?php

namespace Database\Seeders;

use App\Models\ProgramVisibility;
use App\Models\TrainingVisibility;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProgramVisibilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $visibilities = [
            [
                'name' => 'Público',
                'description' => 'Programa con inscripciones disponibles.'
            ],
            [
                'name' => 'Privado',
                'description' => 'Programa especial para ciertos empleados.'
            ],
            [
                'name' => 'Departamento',
                'description' => 'Programa especial departamental.'
            ],
        ];

        foreach ($visibilities as $visibility) {
            ProgramVisibility::create($visibility);
        }
    }
}
