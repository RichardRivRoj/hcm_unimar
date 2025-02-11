<?php

namespace Database\Seeders;

use App\Models\Salary;
use App\Models\Status;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            RolesAndPermissionsSeeder::class,
            StatusSeeder::class,
            ModeSeeder::class,
            BankSeeder::class,
            LevelSeeder::class,
            ContractTypeSeeder::class,
            EmploymentTypeSeeder::class,
            CurrencySeeder::class,
            TypeAgendaSeeder::class,
            IdentificationTypesSeeder::class,
            BankAccountTypeSeeder::class,
            GendersSeeder::class,
            EthnicitiesSeeder::class,
            CountriesSeeder::class,
            MaritalStatusSeeder::class,
            SalarySeeder::class,
            PositionSeeder::class,
            PostulationStatusSeeder::class,
            DepartmentUsersSeeder::class,
            UserRoleSeeder::class,
        ]);
    }
}
