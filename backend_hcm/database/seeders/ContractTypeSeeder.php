<?php

namespace Database\Seeders;

use App\Models\ContractTypes;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContractTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contractTypes = [
            ['name' => 'Indefinido', 'short_name' => 'I', 'description' => 'Contrato sin fecha de finalización definida.'],
            ['name' => 'Temporal', 'short_name' => 'T', 'description' => 'Contrato con una duración específica.'],
            ['name' => 'Obra o servicio', 'short_name' => 'O/S', 'description' => 'Contrato para la realización de una obra o servicio específico.'],
            ['name' => 'Prácticas', 'short_name' => 'P', 'description' => 'Contrato para personas que acaban de finalizar sus estudios.'],
            ['name' => 'Formación y aprendizaje', 'short_name' => 'F/A', 'description' => 'Contrato que combina trabajo y formación.'],
            ['name' => 'Tiempo parcial', 'short_name' => 'TP', 'description' => 'Contrato con menos horas que un empleado a tiempo completo.'],
            ['name' => 'Interinidad', 'short_name' => 'IN', 'description' => 'Contrato para cubrir temporalmente un puesto vacante.'],
            ['name' => 'Alta dirección', 'short_name' => 'AD', 'description' => 'Contrato para empleados en puestos de alta dirección.'],
            ['name' => 'Freelance', 'short_name' => 'F', 'description' => 'Contrato para trabajadores independientes.'],
            ['name' => 'Teletrabajo', 'short_name' => 'TL', 'description' => 'Contrato para empleados que trabajan de forma remota.'],
            
        ];

        foreach ($contractTypes as $type) {
            ContractTypes::create($type);
        }
    }
}
