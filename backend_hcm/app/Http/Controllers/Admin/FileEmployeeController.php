<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FileEmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (!Auth::user()->hasRole('admin')) {
            return response()->json([
                'error' => 'No autorizado',
                'message' => 'Solo los administradores pueden acceder a esta información'
            ], 403);
        }
    
        $filters = [
            'search' => $request->input('search'),
            'department' => $request->input('department'),
            'status' => $request->input('status'),
            'sort' => $request->input('sort', 'asc'),
            'identification' => $request->input('identification')
        ];
    
        $query = Employee::with([
            'person.identificationtype',
            'person.user',
            'contract' => fn($q) => $q->latest()->limit(1)
        ])
        ->withCount(['contract as active_contracts' => fn($q) => $q->active()]);
    
        // Aplicar filtros
        if ($filters['search']) {
            $query->whereHas('person', function($q) use ($filters) {
                $q->where('first_name', 'like', "%{$filters['search']}%")
                  ->orWhere('last_name', 'like', "%{$filters['search']}%");
            });
        }
    
        if ($filters['identification']) {
            $query->whereHas('person', function($q) use ($filters) {
                $q->where('identification_value', 'like', "%{$filters['identification']}%");
            });
        }
    
        if ($filters['department']) {
            $query->whereHas('contract', function($q) use ($filters) {
                $q->where('department_id', $filters['department']);
            });
        }
    
        if ($filters['status']) {
            $query->whereHas('contract', function($q) use ($filters) {
                $filters['status'] === 'Activo' 
                    ? $q->active()
                    : $q->where('status_id', '!=', 1);
            });
        }
    
        // Ordenación por nombre
        $sortDirection = strtolower($filters['sort']) === 'desc' ? 'desc' : 'asc';
        $query->orderBy(
            Person::select('first_name')
                ->whereColumn('persons.id', 'employees.person_id'), 
            $sortDirection
        );
    
        // Transformación de resultados
        $employees = $query->paginate(10)->through(function($employee) {
            $latestContract = $employee->contract->first();
            $currentPosition = $latestContract?->position;
            $currentDepartment = $latestContract?->department;
    
            return [
                'employee_id' => $employee->id,
                'full_name' => $employee->person->first_name . ' ' . $employee->person->last_name,
                'identification' => [
                    'type' => $employee->person->identificationtype->code,
                    'value' => $employee->person->identification_value
                ],
                'current_position' => $currentPosition->description ?? 'N/A',
                'current_department' => $currentDepartment->name ?? 'N/A',
                'email' => $employee->person->user->email,
                'status' => $employee->active_contracts > 0 ? 'Activo' : 'Inactivo',
                'current_contract' => $latestContract ? [
                    'start_date' => $latestContract->star_date,
                    'end_date' => $latestContract->end_date ?? 'Indefinido'
                ] : null
            ];
        });
    
        $departments = Department::all(['id', 'name']);
    
        return response()->json([
            'meta' => [
                'total' => $employees->total(),
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
                'per_page' => $employees->perPage(),
                'filters' => [
                    'available_departments' => $departments,
                    'status_options' => ['Activo', 'Inactivo']
                ]
            ],
            'data' => $employees->items()
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
