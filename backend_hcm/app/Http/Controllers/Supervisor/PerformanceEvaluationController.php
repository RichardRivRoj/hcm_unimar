<?php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EvaluationPeriod;
use App\Models\EvaluationSection;
use App\Models\EvaluationStatus;
use App\Models\Notification;
use App\Models\PerformanceEvaluation;
use App\Models\Position;
use App\Models\QuestionResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PerformanceEvaluationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function getFullStructure()
    {
        try {
            Log::info('Iniciando obtención de estructura de evaluación');

            $sections = EvaluationSection::with(['questions' => function ($query) {
                Log::info('Cargando preguntas para las secciones');
                $query->orderBy('created_at')->select(['id', 'question_text', 'max_score', 'section_id']);
            }])
                ->orderBy('created_at')
                ->get(['id', 'name', 'max_score']);

            Log::info('Secciones cargadas correctamente', ['count' => $sections->count()]);

            return response()->json([
                'status' => 'success',
                'sections' => $sections->map(function ($section) {
                    Log::info('Procesando sección', ['section_id' => $section->id]);
                    return [
                        'id' => $section->id,
                        'name' => $section->name,
                        'max_score' => $section->max_score,
                        'questions' => $section->questions->map(function ($question) {
                            Log::info('Procesando pregunta', ['question_id' => $question->id]);
                            return [
                                'id' => $question->id,
                                'text' => $question->question_text,
                                'max_score' => $question->max_score
                            ];
                        })
                    ];
                })
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener la estructura de evaluación', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener la estructura de evaluación'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            // Validar datos básicos
            $validator = Validator::make($request->all(), [
                'employee_id' => 'required|exists:employees,id',
                'department_id' => 'required|exists:departments,id',
                'responses' => 'required|array',
                'responses.*.question_id' => 'required|exists:section_questions,id',
                'responses.*.score' => 'required|integer|min:1|max:5',
                'responses.*.comments' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            // Obtener periodo activo
            $activePeriod = EvaluationPeriod::whereHas('status', function ($q) {
                $q->where('name', 'Activo');
            })->first();

            if (!$activePeriod) {
                return response()->json(['message' => 'No hay un período de evaluación activo'], 400);
            }

            // Verificar si ya existe evaluación
            $existingEvaluation = PerformanceEvaluation::where([
                'employee_id' => $request->employee_id,
                'period_id' => $activePeriod->id
            ])->exists();

            if ($existingEvaluation) {
                return response()->json(['message' => 'El empleado ya fue evaluado en este período'], 422);
            }

            // Calcular puntuación total
            $totalScore = collect($request->responses)->sum('score');

            // Crear evaluación de desempeño
            $evaluation = PerformanceEvaluation::create([
                'total_score' => $totalScore,
                'evaluation_status_id' => EvaluationStatus::firstOrCreate(['name' => 'Completada'])->id,
                'employee_id' => $request->employee_id,
                'department_id' => $request->department_id,
                'period_id' => $activePeriod->id
            ]);

            // Crear respuestas
            foreach ($request->responses as $response) {
                QuestionResponse::create([
                    'score' => $response['score'],
                    'comments' => $response['comments'] ?? null,
                    'evaluation_id' => $evaluation->id,
                    'question_id' => $response['question_id']
                ]);
            }

            // Notificación para administradores
            $employee = Employee::with('person')->find($request->employee_id);
            $full_name = $employee->person->first_name. ' ' . $employee->person->last_name;
            $period = EvaluationPeriod::find($activePeriod->id);

            $admins = User::role('admin')->get();

            foreach ($admins as $admin) {
                Notification::create([
                    'user_id' => $admin->id,
                    'title' => 'Nueva evaluación completada',
                    'message' => "Evaluación de {$full_name} para el período {$period->name}",
                    'type' => 'info',
                    'metadata' => [
                        'evaluation_id' => $evaluation->id,
                        'employee_id' => $employee->id,
                        'period' => $period->name
                    ]
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Evaluación creada exitosamente',
                'data' => $evaluation->load('response')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al crear la evaluación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($employeeId)
    {
        try {
            // Obtener el empleado con sus relaciones
            $employee = Employee::with([
                'person.identificationType',
                'contracts' => function ($query) {
                    $query->active()
                        ->with(['position', 'employmentType', 'department'])
                        ->latest();
                }
            ])->find($employeeId);

            if (!$employee) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Empleado no encontrado'
                ], 404);
            }

            // Obtener el contrato activo del empleado
            $activeContract = $employee->contracts->first();

            if (!$activeContract) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'El empleado no tiene un contrato activo.'
                ], 404);
            }

            // Obtener el departamento del empleado
            $department = $activeContract->department;

            // Obtener el jefe de departamento basado en los contratos activos y el puesto
            $departmentHead = Employee::whereHas('contracts', function ($query) use ($department) {
                $query->active()
                    ->where('department_id', $department->id)
                    ->whereHas('position', function ($q) {
                        $q->whereIn('description', [
                            'Coordinador',
                            'Jefe de Departamento',
                            'Director',
                            'Vicerrector',
                            'Rector'
                        ]);
                    });
            })->with('person')->first();

            return response()->json([
                'evaluator' => [
                    'department' => $department->name,
                    'head' => $departmentHead ? $departmentHead->person->first_name . ' ' . $departmentHead->person->last_name : 'No asignado'
                ],
                'employee' => [
                    'full_name' => $employee->person->first_name . ' ' . $employee->person->last_name,
                    'position' => $activeContract->position->description,
                    'identification' => $employee->person->identificationType->code . ' ' . $employee->person->identification_value,
                    'contract' => [
                        'start_date' => $activeContract->start_date,
                        'employment_type' => $activeContract->employmentType->name
                    ]
                ],
                'period' => EvaluationPeriod::whereHas('status', function ($q) {
                    $q->where('name', 'Activo');
                })->first()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener datos',
                'error' => $e->getMessage()
            ], 500);
        }
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

    public function unevaluatedEmployees()
    {
        try {
            // 1. Obtener usuario autenticado (supervisor)
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            // 2. Obtener departamento del supervisor
            $departmentId = $user->department_id;

            if (!$departmentId) {
                return response()->json(['message' => 'Supervisor no tiene departamento asignado'], 400);
            }

            // 3. Buscar periodo activo
            $activePeriod = EvaluationPeriod::with('status')
                ->whereHas('status', fn($q) => $q->where('name', 'Activo'))
                ->first();

            if (!$activePeriod) {
                return response()->json(['message' => 'No hay período activo'], 404);
            }

            // 4. Obtener posición de Jefe de Departamento
            $headPosition = Position::where('description', 'Jefe de Departamento')->first();

            if (!$headPosition) {
                return response()->json(['message' => 'Posición de jefe no configurada'], 500);
            }

            // 5. Query para empleados no evaluados
            $employees = Employee::whereHas('contracts', function ($q) use ($departmentId, $headPosition) {
                $q->where('department_id', $departmentId)
                    ->where('position_id', '!=', $headPosition->id)
                    ->active();
            })
                ->whereHas('person.identificationtype')
                ->whereDoesntHave('evaluations', function ($q) use ($activePeriod) {
                    $q->where('period_id', $activePeriod->id);
                })
                ->with([
                    'person:id,first_name,last_name,identification_value,identification_type_id',
                    'person.identificationtype:id,code',
                    'contracts' => fn($q) => $q->with('position:id,description')
                ])
                ->get()
                ->map(function ($employee) {
                    $currentContract = $employee->contracts->first();

                    return [
                        'id' => $employee->id,
                        'name' => $employee->person->first_name . ' ' . $employee->person->last_name,
                        'position' => $currentContract->position->description,
                        'department_id' => $currentContract->department_id,
                        'document' => ($employee->person->identificationtype->code ?? 'ND')
                            . ' '
                            . $employee->person->identification_value,
                    ];
                });

            return response()->json([
                'data' => $employees,
                'active_period' => $activePeriod,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener empleados',
                'error' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTrace() : null
            ], 500);
        }
    }

    // Obtener estructura completa de la evaluación

}
