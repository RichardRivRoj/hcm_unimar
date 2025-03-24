<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear Roles y asignar permisos

        Permission::create(['name' => 'manage recruitment']);
        Permission::create(['name' => 'manage training']);
        Permission::create(['name' => 'evaluate performance']);
        Permission::create(['name' => 'manage personnel']);

        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo(['manage recruitment', 'manage training', 'evaluate performance', 'manage personnel']);

        $supervisor = Role::create([
            'name' => 'supervisor',
        ]);
        $supervisor->givePermissionTo(['manage recruitment', 'evaluate performance']);

        $employee = Role::create(['name' => 'employee']);
        $employee->givePermissionTo(['manage personnel']);
    }
}
