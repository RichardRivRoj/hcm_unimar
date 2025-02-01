<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class DepartmentUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear roles si no existen
        //$adminRole = Role::firstOrCreate(['name' => 'administrador']);
        //$supervisorRole = Role::firstOrCreate(['name' => 'supervisor']);
        //$employeeRole = Role::firstOrCreate(['name' => 'employee']);

        // Datos de los departamentos y sus usuarios
        $departments = [
            [
                'name' => 'Recursos Humanos',
                'description' => 'Departamento de Recursos Humanos.',
                'code' => '00001',
                'email' => 'rrhh@unimar.edu.ve',
                'password' => Hash::make('password123'), // Contraseña por defecto
                'roles' => ['admin', 'supervisor'], // Roles para RRHH
            ],
            [
                'name' => 'Tecnología',
                'description' => 'Departamento de Tecnología.',
                'code' => '00002',
                'email' => 'tecnologia@unimar.edu.ve',
                'password' => Hash::make('password123'), // Contraseña por defecto
                'roles' => ['supervisor'], // Rol para Tecnología
            ],
            [
                'name' => 'Finanzas',
                'description' => 'Departamento de Finanzas.',
                'code' => '00003',
                'email' => 'finanzas@unimar.edu.ve',
                'password' => Hash::make('password123'), // Contraseña por defecto
                'roles' => ['supervisor'], // Rol para Finanzas
            ],
        ];

        // Crear departamentos y usuarios
        foreach ($departments as $departmentData) {
            // Crear el departamento
            $department = Department::create([
                'name' => $departmentData['name'],
                'description' => $departmentData['description'],
                'code' => $departmentData['code'],
            ]);

            // Crear el usuario departamental
            $user = User::create([
                'email' => $departmentData['email'],
                'password' => $departmentData['password'],
                'department_id' => $department->id,
            ]);

            // Asignar roles al usuario
            foreach ($departmentData['roles'] as $roleName) {
                $user->assignRole($roleName);
            }
        }
    }
}
