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
        $admin = User::firstOrCreate([
            'name' => 'Talento Humano',
            'email' => 'rrhh@unimar.edu.ve',
            'password' => bcrypt('Farmacia1.'),
        ]);
        $admin->assignRole('admin');

        $supervisor = User::firstOrCreate([
            'name' => 'Sujey Avane',
            'email' => 'sujey.avane@unimar.edu.ve',
            'password' => bcrypt('Farmacia1.'),
        ]);
        $supervisor->assignRole('supervisor');

        $employee = User::firstOrCreate([
            'name' => 'Richard Rivera',
            'email' => 'rrivera.0753@unimar.edu.ve',
            'password' => bcrypt('Famacia1.'),
        ]);
        $employee->assignRole('employee');
    }
}
