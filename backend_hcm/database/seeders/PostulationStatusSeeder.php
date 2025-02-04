<?php

namespace Database\Seeders;

use App\Models\StatusApplication;
use Illuminate\Database\Seeder;

class PostulationStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['name' => 'Pendiente', 'short_name' => 'PEND'],
            ['name' => 'Aceptado', 'short_name' => 'ACEP'],
            ['name' => 'En Progreso', 'short_name' => 'PROG'],
            ['name' => 'Contratado', 'short_name' => 'CONT'],
        ];

        foreach ($statuses as $status) {
            StatusApplication::create([
                'name' => $status['name'],
                'short_name' => $status['short_name'],
            ]);
        }
    }
}
