<?php

namespace Database\Seeders;

use App\Models\CompletionStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompletionStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['name' => 'Inscrito'],
            ['name' => 'En Proceso'],
            ['name' => 'Completado'],
        ];

        foreach ($statuses as $status) {
            CompletionStatus::create($status);
        }
    }
}
