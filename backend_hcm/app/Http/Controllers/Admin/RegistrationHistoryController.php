<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompletionStatus;
use App\Models\EmployeeTrainingEnrollment;
use App\Models\ProgramVisibility;
use App\Models\TrainingProgram;
use App\Models\TrainingType;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Throwable;

class RegistrationHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'visibility_id' => 'nullable|exists:program_visibilities,id',
            'training_type_id' => 'nullable|exists:training_types,id',
            'completion_status' => 'nullable|string|in:Inscrito,En Progreso,Completado,Cancelado',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $perPage = $validated['per_page'] ?? 10;

        $query = TrainingProgram::with([
            'visibility:id,name',
            'trainingType:id,name',
            'status:id,name'
        ])
            ->whereHas('status', function ($query) {
                $query->where('name', 'Activo');
            })
            ->withCount(['enrollment as total_enrollments']);

        // Aplicar filtros
        if ($request->filled('visibility_id')) {
            $query->where('visibility_id', $validated['visibility_id']);
        }

        if ($request->filled('training_type_id')) {
            $query->where('training_type_id', $validated['training_type_id']);
        }


        $programs = $query->paginate($perPage);

        // Obtener datos para filtros
        $filters = [
            'visibilities' => ProgramVisibility::all(['id', 'name']),
            'training_types' => TrainingType::all(['id', 'name']),
        ];

        return response()->json([
            'data' => $programs->items(),
            'filters' => $filters,
            'meta' => [
                'current_page' => $programs->currentPage(),
                'per_page' => $programs->perPage(),
                'total' => $programs->total(),
                'last_page' => $programs->lastPage(),
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
    public function show($id, Request $request)
    {

        // Validación de parámetros
        $validated = $request->validate([
            'completion_status' => 'nullable|exists:completion_statuses,name',
            'name' => 'nullable|string|max:255',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100'
        ]);

        // Cargar programa principal con relaciones optimizadas
        $program = TrainingProgram::with([
            'trainingType:id,name',
            'modality:id,name',
            'visibility:id,name',
            'status:id,name'
        ])->findOrFail($id);

        // Obtener opciones de filtrado
        $filters = [
            'completion_statuses' => CompletionStatus::pluck('name')
        ];

        // Construir respuesta
        $response = [
            'program' => $this->buildProgramResponse($program),
            'participants' => $this->buildParticipantsResponse($program, $validated),
            'filters' => $filters // Agregar filtros disponibles
        ];

        return response()->json($response);

        return response()->json($response);
    }

    // Método para construir respuesta del programa
    protected function buildProgramResponse($program)
    {
        return [
            'id' => $program->id,
            'name' => $program->name,
            'description' => $program->description,
            'content' => json_decode($program->content, true),
            'schedule' => [
                'start' => $program->start_date->format('Y-m-d'),
                'end' => $program->end_date->format('Y-m-d'),
                'duration' => $program->start_date->diffForHumans($program->end_date, true)
            ],
            'metadata' => [
                'type' => $program->trainingType->name,
                'modality' => $program->modality->name,
                'visibility' => $program->visibility->name,
                'status' => $program->status->name,
                'capacity' => [
                    'total' => $program->limit,
                    'available' => $program->limit - $program->enrollment()->count()
                ]
            ]
        ];
    }

    // Método para construir respuesta de participantes
    protected function buildParticipantsResponse($program, $filters)
    {
        $perPage = $filters['per_page'] ?? 10;

        $query = $program->enrollment()
            ->with([
                'completion:id,name',
                'employee.person:id,first_name,last_name',
                'employee.currentContract.position:id,description',
                'employee.currentContract.department:id,name'
            ])
            ->when($filters['completion_status'] ?? false, function ($q, $status) {
                $q->whereHas('completion', function ($query) use ($status) {
                    $query->where('name', $status);
                });
            })
            ->when($filters['name'] ?? false, function ($q, $search) {
                $q->whereHas('employee.person', function ($query) use ($search) {
                    $query->whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$search}%"]);
                });
            });

        $participants = $query->paginate($perPage);

        return [
            'data' => $participants->map(fn($e) => $this->mapParticipant($e)),
            'meta' => $this->buildPaginationMeta($participants)
        ];
    }

    // Método para mapear participantes
    protected function mapParticipant($enrollment)
    {
        return [
            'id' => $enrollment->id,
            'employee_id' => $enrollment->employee_id,
            'name' => $enrollment->employee->person->first_name . ' ' . $enrollment->employee->person->last_name,
            'email' => $enrollment->employee->person->user->email,
            'position' => optional($enrollment->employee->currentContract->position)->description ?? 'N/A',
            'department' => optional($enrollment->employee->currentContract->department)->name ?? 'N/A',
            'enrollment_date' => $enrollment->enrollment_date->format('Y-m-d'),
            'status' => $enrollment->completion->name,
            'performance' => [
                'score' => $enrollment->score ?? 'N/A',
                'attendance' => $enrollment->attendance_rate ? $enrollment->attendance_rate . '%' : 'N/A'
            ]
        ];
    }

    // Método para metadatos de paginación
    protected function buildPaginationMeta($paginator)
    {
        return [
            'current_page' => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
            'last_page' => $paginator->lastPage()
        ];
    }

    public function showEnroll($id)
    {
        try {
            $enrollment = EmployeeTrainingEnrollment::with([
                'completion:id,name',
                'training' => function ($query) {
                    $query->with([
                        'modality:id,name',
                        'trainingType:id,name',
                        'visibility:id,name',
                        'status:id,name'
                    ])->select(
                        'id',
                        'name',
                        'description',
                        'start_date',
                        'end_date',
                        'modality_id',
                        'training_type_id',
                        'visibility_id',
                        'status_id'
                    );
                },
                'employee' => function ($query) {
                    $query->with([
                        'person' => function ($q) {
                            $q->with([
                                'user:id,email,department_id,person_id',
                                'country:id,name',
                                'gender:id,name',
                                'identificationtype:id,name,code'
                            ])->select(
                                'id',
                                'first_name',
                                'last_name',
                                'email',
                                'phone',
                                'birth_date',
                                'identification_value',
                                'identification_type_id',
                                'gender_id',
                                'countries_id'
                            );
                        },
                        'currentContract' => function ($q) {
                            $q->with([
                                'position:id,description',
                                'department:id,name',
                                'contractType:id,name'
                            ])->active()->select(
                                'id',
                                'start_date',
                                'department_id',
                                'position_id',
                                'contract_type_id',
                                'employee_id'
                            );
                        }
                    ])->select('id', 'person_id');
                }
            ])->findOrFail($id);

            return $this->buildResponse($enrollment);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Recurso no encontrado'], 404);
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Error crítico',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    protected function buildResponse($enrollment)
    {
        $contract = $enrollment->employee->currentContract;
        $training = $enrollment->training;

        return response()->json([
            'enrollment' => [
                'id' => $enrollment->id,
                'enrollment_date' => optional($enrollment->enrollment_date)->format('Y-m-d'), // Fecha de inscripción
                'status' => $enrollment->completion->name, // Estado
                'score' => $enrollment->score, // Puntaje
                'attendance_rate' => $enrollment->attendance_rate, // Asistencia
                'assigned_by' => $enrollment->assigned_by_admin // Asignado por
            ],
            'employee' => [
                'full_name' => $enrollment->employee->person->first_name . ' ' . $enrollment->employee->person->last_name, // Nombre completo
                'identification' => [
                    'code' => $enrollment->employee->person->identificationtype->code, // Tipo de identificación
                    'number' => $enrollment->employee->person->identification_value // Número de identificación
                ],
                'current_contract' => [
                    'department' => $contract->department->name, // Departamento
                    'position' => $contract->position->description, // Cargo
                    'contract_type' => $contract->contractType->name, // Tipo de contrato
                    'start_date' => optional($contract->start_date)->format('Y-m-d') // Fecha de inicio
                ],
                'contact' => [
                    'corporate_email' => $enrollment->employee->person->user->email, // Email corporativo
                    'phone' => $enrollment->employee->person->phone // Teléfono
                ]
            ],
            'program' => [
                'name' => $training->name, // Nombre
                'description' => $training->description, // Descripción
                'schedule' => [
                    'start' => optional($training->start_date)->format('Y-m-d'), // Fecha de inicio
                    'end' => optional($training->end_date)->format('Y-m-d'), // Fecha de fin
                    'duration' => $training->start_date->diffInDays($training->end_date) . ' dias' // Duración
                ],
                'modality' => $training->modality->name, // Modalidad
                'type' => $training->trainingType->name, // Tipo
                'visibility' => $training->visibility->name, // Visibilidad
                'status' => $training->status->name // Estado
            ]
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
        $validated = $request->validate([
            'score' => 'required|numeric|between:0,100',
            'attendance_rate' => 'required|numeric|between:0,100'
        ]);

        $enrollment = EmployeeTrainingEnrollment::findOrFail($id);

        $updateData = [
            'score' => $validated['score'],
            'attendance_rate' => $validated['attendance_rate'],
            'completion_status_id' => 3 // ID del estado "Completado"
        ];

        $enrollment->update($updateData);

        return response()->json([
            'message' => 'Calificaciones actualizadas exitosamente',
            'enrollment' => $enrollment->load('completion', 'employee', 'training')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
