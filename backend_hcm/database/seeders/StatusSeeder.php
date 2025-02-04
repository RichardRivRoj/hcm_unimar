<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['name' => 'Activo'],
            ['name' => 'Inactivo'],
            // Puedes agregar más estados si es necesario
        ];

        // Usar el método create para cada estado
        foreach ($statuses as $status) {
            Status::create($status);
        } 
    }
}
