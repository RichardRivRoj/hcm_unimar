<?php

namespace Database\Seeders;

use App\Models\IdentificationType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IdentificationTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $identificationTypes = [
            ['code' => 'V', 'name' => 'Cédula de Identidad', 'description' => 'Documento principal de identificación para ciudadanos venezolanos'],
            ['code' => 'P', 'name' => 'Pasaporte', 'description' => 'Documento de identificación para viajes internacionales'],
            ['code' => 'E', 'name' => 'Cédula de Extranjería', 'description' => 'Documento de identificación para extranjeros residentes en Venezuela'],
            ['code' => 'R', 'name' => 'Registro de Información Fiscal', 'description' => 'Documento de identificación fiscal para personas naturales y jurídicas'],
            ['code' => 'C', 'name' => 'Carnet de la Patria', 'description' => 'Documento de identificación para acceder a programas sociales del gobierno'],
            ['code' => 'L', 'name' => 'Licencia de Conducir', 'description' => 'Documento de identificación para conductores'],
            ['code' => 'N', 'name' => 'Partida de Nacimiento', 'description' => 'Documento que certifica el nacimiento de una persona'],
            ['code' => 'T', 'name' => 'Permiso de Trabajo', 'description' => 'Documento que autoriza a un extranjero a trabajar en Venezuela'],
            ['code' => 'M', 'name' => 'Tarjeta de Identificación Militar', 'description' => 'Documento de identificación para miembros de las fuerzas armadas'],
            ['code' => 'D', 'name' => 'Documento de Identificación Estudiantil', 'description' => 'Documento de identificación para estudiantes'],
        ];

        foreach ($identificationTypes as $type) {
            IdentificationType::create([
                'code' => $type['code'],
                'name' => $type['name'],
                'description' => $type['description'],
                'status' => 1,
            ]);
        }
    }
}
