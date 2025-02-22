<?php

namespace Database\Seeders;

use App\Models\TrainingType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TrainingTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $trainingTypes = [
            [
                'name' => 'Curso',
                'description' => 'Programa estructurado con objetivos de aprendizaje específicos, generalmente con evaluación final.'
            ],
            [
                'name' => 'Taller',
                'description' => 'Sesión práctica enfocada en desarrollar habilidades específicas mediante ejercicios y actividades.'
            ],
            [
                'name' => 'Conversatorio',
                'description' => 'Espacio de diálogo e intercambio de ideas entre expertos y participantes.'
            ],
            [
                'name' => 'Seminario',
                'description' => 'Evento académico o profesional que profundiza en un tema específico, con participación activa de los asistentes.'
            ],
            [
                'name' => 'Webinar',
                'description' => 'Sesión formativa en línea, generalmente con un experto que comparte conocimientos sobre un tema.'
            ],
            [
                'name' => 'Certificación',
                'description' => 'Programa que acredita competencias específicas mediante evaluación y emisión de un certificado.'
            ],
            [
                'name' => 'Diplomado',
                'description' => 'Programa de formación avanzada que cubre un área de conocimiento en profundidad.'
            ],
            [
                'name' => 'Workshop',
                'description' => 'Sesión intensiva y práctica para resolver problemas o desarrollar proyectos específicos.'
            ],
            [
                'name' => 'Charla Técnica',
                'description' => 'Presentación breve sobre un tema técnico o especializado.'
            ],
            [
                'name' => 'Programa de Inducción',
                'description' => 'Capacitación inicial para nuevos empleados sobre políticas, procesos y cultura organizacional.'
            ]
        ];

        foreach ($trainingTypes as $type) {
            TrainingType::create($type);
        }
    }
}
