<?php

namespace Database\Seeders;

use App\Models\AccountType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BankAccountTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accountTypes = [
            ['name' => 'Corriente'],
            ['name' => 'Ahorros'],
            ['name' => 'Nómina'],
            ['name' => 'Moneda Extranjera'],
        ];

        foreach ($accountTypes as $type) {
            AccountType::create($type);
        }
    }
}
