<?php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClasificationEmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Obtener el usuario autenticado
        $supervisor = Auth::user();

        // Verificar que el usuario sea supervisor
        if (!$supervisor->hasRole('supervisor')) {
            return response()->json([
                'error' => 'No autorizado',
                'message' => 'Solo los supervisores pueden acceder a esta información'
            ], 403);
        }

        // Obtener el departamento del supervisor
        $department = $supervisor->department;

        if (!$department) {
            return response()->json([
                'error' => 'Departamento no encontrado',
                'message' => 'El supervisor no tiene un departamento asignado'
            ], 404);
        }

        // Obtener parámetros de búsqueda
        $search = $request->input('search');
        $position = $request->input('position');

        // Consulta base con relaciones
        $query = Employee::with([
                'persons.identificationtype',
                'position',
                'contract',
                'persons.user'
            ])
            ->where('department_id', $department->id)
            ->whereHas('contract', function($query) {
                $query->where('status_id', 1);
            });

        // Aplicar filtros
        if ($search) {
            $query->whereHas('persons', function($q) use ($search) {
                $q->where('first_name', 'like', "%$search%")
                  ->orWhere('last_name', 'like', "%$search%");
            });
        }

        if ($position) {
            $query->whereHas('position', function($q) use ($position) {
                $q->where('description', 'like', "%$position%");
            });
        }

        // Paginación y transformación de datos
        $employees = $query->paginate(4)->through(function($employee) {
            return [
                'employe_id' => $employee->id,
                'full_name' => $employee->persons->first_name . ' ' . $employee->persons->last_name,
                'identification_type' => $employee->persons->identificationtype->code,
                'identification_value' => $employee->persons->identification_value,
                'position' => $employee->position->description,
                'department' => $employee->department->name,
                'email' => $employee->persons->user->email,
                'status' => $employee->contract->status,
                'contract_start' => $employee->contract->star_date,
                'contract_end' => $employee->contract->end_date ?? 'Indefinido'
            ];
        });

        return response()->json([
            'department' => $department->name,
            'total_employees' => $employees->total(),
            'current_page' => $employees->currentPage(),
            'last_page' => $employees->lastPage(),
            'per_page' => $employees->perPage(),
            'employees' => $employees->items()
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
        $employee = User::with([
            'persons' => function($query) {
                $query->with([
                    'documents' => function($q) {
                        $q->orderBy('issue_date', 'desc')->take(2);
                    },
                    'jobs' => function($q) {
                        $q->orderBy('start_date', 'desc');
                    },
                    'studies' => function($q) {
                        $q->orderBy('start_date', 'desc');
                    },
                    'courses' => function($q) {
                        $q->orderBy('start_date', 'desc');
                    },
                    'languages',
                    'competencies'
                ]);
            }
        ])->findOrFail($id);
    
        // Transformamos los datos manualmente
        $response = [
            'id' => $employee->id,
            'email' => $employee->email,
            'person' => [
                'first_name' => $employee->persons->first_name,
                'last_name' => $employee->persons->last_name,
                'identification_type' => $employee->persons->identification_type,
                'identification_value' => $employee->persons->identification_value,
                'birth_date' => $employee->persons->birth_date,
                'gender' => $employee->persons->gender,
                'phone' => $employee->persons->phone,
                'country' => $employee->persons->country,
                'photo_url' => $employee->persons->photo_url,
                'documents' => $employee->persons->documents->map(function($document) {
                    return [
                        'type' => $document->type,
                        'issue_date' => $document->issue_date,
                        'file_url' => $document->file_url
                    ];
                }),
                'jobs' => $employee->persons->jobs->map(function($job) {
                    return [
                        'position' => $job->position,
                        'company' => $job->company,
                        'location' => $job->location,
                        'start_date' => $job->start_date,
                        'end_date' => $job->end_date,
                        'responsibilities' => $job->responsibilities
                    ];
                }),
                'studies' => $employee->persons->studies->map(function($study) {
                    return [
                        'institution' => $study->institution,
                        'degree' => $study->degree,
                        'start_date' => $study->start_date,
                        'end_date' => $study->end_date
                    ];
                }),
                'courses' => $employee->persons->courses->map(function($course) {
                    return [
                        'name' => $course->name,
                        'institution' => $course->institution,
                        'hours' => $course->hours,
                        'start_date' => $course->start_date,
                        'end_date' => $course->end_date
                    ];
                }),
                'languages' => $employee->person->languages->map(function($language) {
                    return [
                        'name' => $language->name,
                        'level' => $language->level
                    ];
                }),
                'competencies' => $employee->person->competencies->map(function($competency) {
                    return [
                        'name' => $competency->name,
                        'level' => $competency->level
                    ];
                })
            ]
        ];
    
        return response()->json([
            'employee' => $response
        ]);
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
