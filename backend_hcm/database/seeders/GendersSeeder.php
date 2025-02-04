<?php

namespace Database\Seeders;

use App\Models\Gender;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GendersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $genders = [
            ['name' => 'Masculino', 'short_name' => 'M'],
            ['name' => 'Femenino', 'short_name' => 'F'],
            ['name' => 'Otro', 'short_name' => 'O'],
            ['name' => 'No Binario', 'short_name' => 'N'],
            ['name' => 'Prefiero no decir', 'short_name' => 'P'],
        ];

        foreach ($genders as $gender) {
            Gender::create([
                'name' => $gender['name'],
                'short_name' => $gender['short_name'],
            ]);
        }
    }
}
