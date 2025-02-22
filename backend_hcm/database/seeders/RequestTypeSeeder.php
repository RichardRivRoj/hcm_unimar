<?php

namespace Database\Seeders;

use App\Models\RequestType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RequestTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'name' => 'Solicitud de Vacaciones',
                'description' => 'Proceso para solicitar días de descanso remunerado según política de vacaciones'
            ],
            [
                'name' => 'Permiso Especial',
                'description' => 'Solicitud de ausencia temporal por motivos personales o familiares'
            ],
            [
                'name' => 'Anticipo de Sueldo',
                'description' => 'Solicitud de adelanto de remuneración antes de la fecha de pago regular'
            ],
            [
                'name' => 'Constancia Laboral',
                'description' => 'Generación de documento que acredita relación laboral y tiempo de servicio'
            ],
            [
                'name' => 'Cambio de Datos Personales',
                'description' => 'Actualización de información personal (dirección, contacto, beneficiarios)'
            ],
            [
                'name' => 'Solicitud de Capacitación',
                'description' => 'Petición para participar en programas de formación y desarrollo'
            ],
            [
                'name' => 'Informe de Ausentismo',
                'description' => 'Reporte y justificación de inasistencias al puesto de trabajo'
            ],
            [
                'name' => 'Reclamo de Beneficios',
                'description' => 'Gestión de incidencias relacionadas con prestaciones laborales'
            ],
            [
                'name' => 'Licencia Médica',
                'description' => 'Proceso para validar incapacidades y permisos por enfermedad'
            ],
            [
                'name' => 'Renuncia Voluntaria',
                'description' => 'Procedimiento formal para finalización de contrato laboral'
            ]
        ];

        foreach ($types as $type) {
            RequestType::create($type);
        }
    }
}
