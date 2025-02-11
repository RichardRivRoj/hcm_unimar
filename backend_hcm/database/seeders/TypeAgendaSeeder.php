<?php

namespace Database\Seeders;

use App\Models\TypeAgenda;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeAgendaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $typeAgendas = [
            ['name' => 'Entrevista', 'description' => 'Citas para entrevistas de trabajo'],
            ['name' => 'Evaluaciones Psicológicas', 'description' => 'Citas para evaluaciones psicológicas'],
            ['name' => 'Evaluaciones Médicas', 'description' => 'Citas para exámenes médicos'],
            ['name' => 'Administrativas', 'description' => 'Citas para trámites administrativos'],
        ];

        foreach ($typeAgendas as $type) {
            TypeAgenda::create($type);
        }
    }
}
