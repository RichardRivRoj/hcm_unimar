<?php

namespace Database\Seeders;

use App\Models\MaritalStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MaritalStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['name' => 'Soltero/a', 'short_name' => 'S'],
            ['name' => 'Casado/a', 'short_name' => 'C'],
            ['name' => 'Divorciado/a', 'short_name' => 'D'],
            ['name' => 'Viudo/a', 'short_name' => 'V'],
            ['name' => 'Unión Civil', 'short_name' => 'U'],
            ['name' => 'Separado/a', 'short_name' => 'E'],
            ['name' => 'Otro', 'short_name' => 'O'],
            ['name' => 'Prefiero no decir', 'short_name' => 'P'],
        ];

        foreach ($statuses as $status) {
            MaritalStatus::create([
                'name' => $status['name'],
                'short_name' => $status['short_name'],
            ]);
        }
    }
}
