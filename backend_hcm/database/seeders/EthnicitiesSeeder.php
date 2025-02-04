<?php

namespace Database\Seeders;

use App\Models\Ethnicity;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EthnicitiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ethnicities = [
            ['name' => 'Afrodescendiente', 'short_name' => 'A'],
            ['name' => 'Indígena', 'short_name' => 'I'],
            ['name' => 'Mestizo', 'short_name' => 'M'],
            ['name' => 'Blanco', 'short_name' => 'B'],
            ['name' => 'Asiático', 'short_name' => 'S'],
            ['name' => 'Otro', 'short_name' => 'O'],
            ['name' => 'Prefiero no decir', 'short_name' => 'P'],
        ];

        foreach ($ethnicities as $ethnicity) {
            Ethnicity::create([
                'name' => $ethnicity['name'],
                'short_name' => $ethnicity['short_name'],
            ]);
        }
    }
}
