<?php

namespace Database\Seeders;

use App\Models\DocumentTypes;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DocumentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $documentTypes = [
            ['name' => 'Empleos'],
            ['name' => 'Estudios'],
            ['name' => 'Cursos'],
            ['name' => 'Certificados'],
            ['name' => 'Diplomados'],
            ['name' => 'RIF'],
            ['name' => 'Reposos'],
            ['name' => 'Referencias'],
            ['name' => 'Otros']
        ];

        foreach($documentTypes as $types) {
            DocumentTypes::create($types);
        }
    }
}
