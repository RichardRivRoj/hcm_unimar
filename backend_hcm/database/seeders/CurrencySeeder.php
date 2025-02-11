<?php

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Definir las monedas
        $currencies = [
            [
                'name' => 'Bolívar',
                'short_name' => 'VES',
            ],
            [
                'name' => 'Dólar Estadounidense',
                'short_name' => 'USD',
            ],
            [
                'name' => 'Euro',
                'short_name' => 'EUR',
            ],
            [
                'name' => 'Peso Colombiano',
                'short_name' => 'COP',
            ],
            [
                'name' => 'Peso Mexicano',
                'short_name' => 'MXN',
            ],
            [
                'name' => 'Sol Peruano',
                'short_name' => 'PEN',
            ],
            [
                'name' => 'Real Brasileño',
                'short_name' => 'BRL',
            ],
            [
                'name' => 'Yuan Chino',
                'short_name' => 'CNY',
            ],
            [
                'name' => 'Yen Japonés',
                'short_name' => 'JPY',
            ],
            [
                'name' => 'Libra Esterlina',
                'short_name' => 'GBP',
            ],
        ];

        // Insertar las monedas en la base de datos
        foreach ($currencies as $currency) {
            Currency::create($currency);
        }

    }
}
