<?php

namespace Database\Seeders;

use App\Models\Modality;
use Illuminate\Database\Seeder;

class ModeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modalities = [
            [
                'name' => 'Presencial',
                'description' => 'Trabajo realizado en la oficina o lugar físico designado por la empresa, con horario fijo y supervisión directa.'
            ],
            [
                'name' => 'Remoto',
                'description' => 'Trabajo ejecutado desde cualquier ubicación fuera de la oficina, utilizando herramientas digitales para comunicación y colaboración.'
            ],
            [
                'name' => 'Híbrido',
                'description' => 'Combinación flexible entre días de trabajo en la oficina y días de trabajo desde otro lugar.'
            ],
            [
                'name' => 'Freelance',
                'description' => 'Modalidad independiente donde el trabajador gestiona sus propios proyectos y clientes sin contrato fijo.'
            ],
            [
                'name' => 'Tiempo Parcial',
                'description' => 'Horario reducido de trabajo, ideal para compatibilizar con estudios u otras responsabilidades.'
            ],
            [
                'name' => 'Tiempo Completo',
                'description' => 'Jornada laboral completa (generalmente 40 horas semanales) con beneficios empresariales.'
            ],
            [
                'name' => 'Por Proyectos',
                'description' => 'Contrato temporal vinculado a la entrega de un proyecto específico con objetivos definidos.'
            ],
            [
                'name' => 'Rotativo',
                'description' => 'Turnos laborales que alternan entre mañana, tarde y noche, común en sectores operativos.'
            ],
            [
                'name' => 'Autónomo',
                'description' => 'Trabajador que gestiona su propia empresa o marca, asumiendo riesgos y beneficios empresariales.'
            ],
            [
                'name' => 'Trabajo por Turnos',
                'description' => 'Horarios fijos en turnos específicos (ej: solo nocturno), sin rotación entre ellos.'
            ],
            [
                'name' => 'Trabajo Temporal',
                'description' => 'El empleado es contratado por un período corto o para cubrir una necesidad específica.'
            ],
            [
                'name' => 'Trabajo por Horas',
                'description' => 'El empleado es pagado por las horas trabajadas, sin un salario fijo.'
            ],
            [
                'name' => 'Trabajo en Equipo',
                'description' => 'El empleado trabaja en un equipo donde las responsabilidades y tareas se comparten.'
            ],
            [
                'name' => 'Trabajo por Objetivos',
                'description' => 'El empleado es evaluado y remunerado en función del cumplimiento de objetivos específicos.'
            ],
            [
                'name' => 'Trabajo en Exteriores',
                'description' => 'El empleado realiza su trabajo en diferentes ubicaciones fuera de una oficina.'
            ]
        ];

        foreach ($modalities as $modality) {
            Modality::create($modality);
        };
    }
}
