<?php

namespace Database\Seeders;

use App\Models\Bank;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banks = [
            ['name' => 'Banco de Venezuela', 'short_name' => 'BDV', 'code' => '0102'],
            ['name' => 'Banco Central de Venezuela', 'short_name' => 'BCV', 'code' => '0100'],
            ['name' => 'Banco Provincial', 'short_name' => 'BBVA Provincial', 'code' => '0108'],
            ['name' => 'Bancaribe', 'short_name' => 'Bancaribe', 'code' => '0114'],
            ['name' => 'Banco Exterior', 'short_name' => 'Exterior', 'code' => '0115'],
            ['name' => 'Banco Occidental de Descuento', 'short_name' => 'BOD', 'code' => '0116'],
            ['name' => 'Banco del Tesoro', 'short_name' => 'Tesoro', 'code' => '0163'],
            ['name' => 'Banco Nacional de Crédito', 'short_name' => 'BNC', 'code' => '0191'],
            ['name' => 'Banco Mercantil', 'short_name' => 'Mercantil', 'code' => '0105'],
            ['name' => 'Banco Digital de los Trabajadores, Banco Universal', 'short_name' => 'Bicentenario', 'code' => '0175'],
            ['name' => 'Banplus', 'short_name' => 'Banplus', 'code' => '0174'],
            ['name' => 'Banco Activo', 'short_name' => 'Activo', 'code' => '0171'],
            ['name' => 'Banco Venezolano de Crédito', 'short_name' => 'Venezolano de Crédito', 'code' => '0104'],
            ['name' => 'Banco Agrícola de Venezuela', 'short_name' => 'Agrícola', 'code' => '0166'],
            ['name' => 'Banco de la Fuerza Armada Nacional Bolivariana', 'short_name' => 'Banfanb', 'code' => '0177'],
            ['name' => 'Banco del Pueblo Soberano', 'short_name' => 'Pueblo Soberano', 'code' => '0169'],
            ['name' => 'Banco Sofitasa', 'short_name' => 'Sofitasa', 'code' => '0137'],
            ['name' => '100% Banco', 'short_name' => '100% Banco', 'code' => '0156'],
            ['name' => 'Banco Plaza', 'short_name' => 'Plaza', 'code' => '0138'],
            ['name' => 'Banco Caroní', 'short_name' => 'Caroní', 'code' => '0128'],
            ['name' => 'Bandes', 'short_name' => 'Bandes', 'code' => '0152'],
            ['name' => 'Banco Fondo Común', 'short_name' => 'Fondo Común', 'code' => '0151'],
            ['name' => 'Banco de Exportación y Comercio', 'short_name' => 'Bancoex', 'code' => '0149'],
            ['name' => 'Banesco', 'short_name' => 'Banesco', 'code' => '0134'],
            ['name' => 'Bancrecer', 'short_name' => 'Bancrecer', 'code' => '0168'],
            ['name' => 'Bancamiga Banco Microfinanciero CA', 'short_name' => 'Bancamiga', 'code' => '0172'],
        ];

        foreach ($banks as $bank) {
            Bank::create($bank);
        }
    }
}
