<?php

namespace Database\Seeders;

use App\Models\TrainingModality;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TrainingModalitiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modalities = [
            [
                'name' => 'Presencial',
                'description' => 'Programas que se llevan a cabo en un lugar físico específico, con asistencia directa de los participantes.'
            ],
            [
                'name' => 'Virtual',
                'description' => 'Programas impartidos en línea, permitiendo la participación desde cualquier ubicación.'
            ],
            [
                'name' => 'Híbrido',
                'description' => 'Combinación de modalidad presencial y virtual, ofreciendo flexibilidad a los participantes.'
            ],
            [
                'name' => 'Autodirigido',
                'description' => 'Programas en los que los participantes avanzan a su propio ritmo, sin horarios fijos.'
            ],
            [
                'name' => 'Semi-presencial',
                'description' => 'Programas que combinan sesiones presenciales con actividades en línea.'
            ],
        ];

        foreach ($modalities as $modality) {
            TrainingModality::create($modality);
        }
    }
}
