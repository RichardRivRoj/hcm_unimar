<?php

namespace Database\Seeders;

use App\Models\Currency;
use App\Models\Level;
use App\Models\Salary;
use App\Models\Status;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SalarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener la moneda predeterminada (Bolívar, VES)
        $currency = Currency::where('short_name', 'VES')->first();

        // Obtener el estado predeterminado (asumimos que existe un estado con ID 1)
        $status = Status::find(1);

        // Fechas predeterminadas
        $validFrom = Carbon::now()->startOfYear(); // Inicio del año actual
        $validTo = Carbon::now()->endOfYear(); // Fin del año actual

        // Salarios predeterminados para cada nivel
        $salaries = [
            ['level' => 'I', 'amount' => 1000.00, 'amount_letters' => 'Mil Bolívares'],
            ['level' => 'II', 'amount' => 1500.00, 'amount_letters' => 'Mil Quinientos Bolívares'],
            ['level' => 'III', 'amount' => 2000.00, 'amount_letters' => 'Dos Mil Bolívares'],
            ['level' => 'IV', 'amount' => 2500.00, 'amount_letters' => 'Dos Mil Quinientos Bolívares'],
            ['level' => 'V', 'amount' => 3000.00, 'amount_letters' => 'Tres Mil Bolívares'],
            ['level' => 'VI', 'amount' => 3500.00, 'amount_letters' => 'Tres Mil Quinientos Bolívares'],
            ['level' => 'VII', 'amount' => 4000.00, 'amount_letters' => 'Cuatro Mil Bolívares'],
            ['level' => 'VIII', 'amount' => 4500.00, 'amount_letters' => 'Cuatro Mil Quinientos Bolívares'],
            ['level' => 'IX', 'amount' => 5000.00, 'amount_letters' => 'Cinco Mil Bolívares'],
            ['level' => 'X', 'amount' => 5500.00, 'amount_letters' => 'Cinco Mil Quinientos Bolívares'],
        ];

        foreach ($salaries as $salaryData) {
            // Obtener el nivel correspondiente
            $level = Level::where('name', $salaryData['level'])->first();

            // Crear el salario
            Salary::create([
                'amount' => $salaryData['amount'],
                'amount_letters' => $salaryData['amount_letters'],
                'valid_from' => $validFrom,
                'valid_to' => $validTo,
                'currency_id' => $currency->id,
                'level_id' => $level->id,
                'status_id' => $status->id,
            ]);
        }
    }
}
