<?php

namespace Database\Seeders;

use App\Models\EvaluationStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EvaluationStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['name' => 'En Proceso'],
            ['name' => 'Completado'],
        ];

        foreach ($statuses as $status) {
            EvaluationStatus::create($status);
        }
    }
}
