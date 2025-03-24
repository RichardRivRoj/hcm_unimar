<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContractController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        // Después (corregido):
        $user->load([
            'person.employee.contracts' => function ($query) {
                $query->latest()->with([
                    'contractType',
                    'employmentType',
                    'department',
                    'position.level.salaries.currency'
                ]);
            },
            'person.identificationType',
            'person.country'
        ]);

        $person = $user->person;

        if (!$person || !$person->employee) {
            return response()->json(['error' => 'No se encontró información completa del empleado'], 404);
        }

        // Acceso seguro a relaciones anidadas
        $employee = $person->employee;
        $latestContract = optional($person->employee->contracts)->sortByDesc('start_date')->first();

        $position = optional($latestContract)->position;
        $department = optional($latestContract)->department;
        $level = optional($position)->level;
        $salary = optional($level->salaries)->first();

        // Paginación de contratos
        $contracts = $employee->contracts()
            ->with(['contractType', 'employmentType', 'status', 'position', 'department'])
            ->paginate(4);

        return response()->json([
            'personal_info' => [
                'full_name' => $person->first_name . ' ' . $person->last_name,
                'position' => $position->description ?? 'No especificado',
                'department' => $department->name ?? 'Sin departamento',
                'identification' => $person->identificationtype->code . '-' . $person->identification_value ?? 'Sin documento',
                'country' => $person->country->long_name,
            ],
            'contracts' => $contracts->map(function ($contract) {
                return [
                    'id' => $contract->id,
                    'contract_number' => $contract->contract_number,
                    'type' => $contract->contractType->name ?? 'No especificado',
                    'start_date' => Carbon::parse($contract->start_date)->format('d-m-Y'),
                    'end_date' => $contract->end_date ? Carbon::parse($contract->end_date)->format('d-m-Y') : 'Indefinido',
                    'status' => $contract->status->name ?? 'Sin estado'
                ];
            }),
            'level_info' => $level ? [
                'name' => $level->name,
            ] : null,
            'salary_info' => $salary ? [
                'amount' => $salary->amount,
                'currency' => $salary->currency->short_name ?? 'USD'
            ] : null,
            'meta' => [
                'current_page' => $contracts->currentPage(),
                'total_pages' => $contracts->lastPage(),
                'total_items' => $contracts->total()
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
