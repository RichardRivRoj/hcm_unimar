<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $supervisor = User::firstOrCreate([
            'email' => 'sujey.avane@unimar.edu.ve',
            'password' => bcrypt('Farmacia1.'),
        ]);
        $supervisor->assignRole('employee');

        $employee = User::firstOrCreate([
            'email' => 'rrivera.0753@unimar.edu.ve',
            'password' => bcrypt('Farmacia1.'),
        ]);
        $employee->assignRole('employee');
    }
}
