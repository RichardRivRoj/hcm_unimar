<?php

namespace Database\Seeders;

use App\Models\RequestStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RequestStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['name' => 'Pendiente'],
            ['name' => 'En Revisión'],
            ['name' => 'Aprobado'],
            ['name' => 'Rechazado'],
            ['name' => 'En Proceso'],
            ['name' => 'Completado'],
            ['name' => 'Cancelado'],
            ['name' => 'Requiere más información'],
            ['name' => 'Reabierto'],
            ['name' => 'En Espera de Documentación']
        ];

        foreach ($statuses as $status) {
            RequestStatus::create($status);
        }
    }
}
