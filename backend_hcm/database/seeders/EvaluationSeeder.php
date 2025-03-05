<?php

namespace Database\Seeders;

use App\Models\EvaluationSection;
use App\Models\SectionQuestion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EvaluationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Definir las secciones y preguntas
        $sections = [
            'Calidad de Trabajo' => [
                'max_score' => 20,
                'questions' => [
                    'Demuestra conocimiento e interés en áreas de la función de trabajo.',
                    'Se expresa verbalmente y por escrito, usando el lenguaje técnico correspondiente.',
                    'Mantiene su puesto y herramientas de trabajo limpias y ordenadas.',
                    'Es capaz de comprender situaciones bajo presión y buscar soluciones rápidamente.'
                ]
            ],
            'Cantidad de Trabajo' => [
                'max_score' => 20,
                'questions' => [
                    'Necesita de supervisión continua para realizar los trabajos asignados.',
                    'Mantiene una comunicación clara y asertiva con compañeros y supervisor inmediato.',
                    'Muestra compromiso con el desarrollo de las funciones de su puesto de trabajo.',
                    'Maneja y desarrolla varias actividades, sin descuidar el trabajo asignado por superiores.'
                ]
            ],
            'Hábitos de Trabajo' => [
                'max_score' => 20,
                'questions' => [
                    'Asiste al trabajo de forma permanente, puntual y responsable.',
                    'Es una persona proactiva y capaz de aportar ideas innovadoras.',
                    'Es disciplinado en la revisión, valores y objetivos de la empresa.',
                    'Está dispuesto a rendir un servicio abundante y mejor.'
                ]
            ],
            'Relaciones Interpersonales' => [
                'max_score' => 20,
                'questions' => [
                    'Es cooperativo y ayuda a los compañeros con satisfacción.',
                    'Es capaz de respetar, aceptar críticas y acatar recomendaciones hechas por otros.',
                    'Cree en el trabajo en equipo y demuestra esfuerzo para el cumplimiento de metas.',
                    'Muestra alto nivel de habilidades y destrezas laborales e interpersonales.'
                ]
            ],
            'Iniciativa y Cooperación' => [
                'max_score' => 20,
                'questions' => [
                    'Comprende y acepta nuevas situaciones o cambios.',
                    'Cumple con instrucciones asignadas por el supervisor de forma organizada.',
                    'Ejecuta sus funciones eficazmente, con un mínimo de instrucción.',
                    'Toma decisiones y realiza el trabajo asignado en ausencia de su superior.'
                ]
            ],
        ];

        // Insertar en la base de datos usando modelos de Eloquent
        foreach ($sections as $sectionName => $data) {
            $section = EvaluationSection::create([
                'name' => $sectionName,
                'max_score' => $data['max_score'],
            ]);

            foreach ($data['questions'] as $questionText) {
                SectionQuestion::create([
                    'question_text' => $questionText,
                    'max_score' => 5, // Máximo puntaje por pregunta
                    'evaluation_section_id' => $section->id,
                ]);
            }
        }
    }
}
