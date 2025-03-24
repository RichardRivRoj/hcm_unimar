<?php

namespace Database\Seeders;

use App\Models\PaymentTerm;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentTermSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $terms = [
            [
                'name' => 'Por objetivos',
                'description' => 'Pago por objetivos cumplidos',
                'reference' => null,  // No aplica días
            ],
            [
                'name' => 'Dias',
                'description' => 'Pago diario',
                'reference' => 1,
            ],
            [
                'name' => 'Semanal',
                'description' => 'Pago cada semana',
                'reference' => 7,
            ],
            [
                'name' => 'Quincenal',
                'description' => 'Pago cada quincena',
                'reference' => 15,
            ],
            [
                'name' => 'Mensual',
                'description' => 'Pago mensual',
                'reference' => 30,
            ],
            [
                'name' => 'Trimestral',
                'description' => 'Pago cada trimestre',
                'reference' => 90,
            ],
        ];

        foreach ($terms as $term) {
            PaymentTerm::create([
                'name' => $term['name'],
                'description' => $term['description'],
                'reference' => $term['reference'],
            ]);
        }
    }
}
