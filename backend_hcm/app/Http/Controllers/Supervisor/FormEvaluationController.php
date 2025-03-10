<?php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EvaluationPeriod;
use App\Models\PerformanceEvaluation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FormEvaluationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['message' => 'Usuario no autenticado'], 401);

        $supervisorDepartmentId = $user->department_id;
        if (!$supervisorDepartmentId) return response()->json(['message' => 'Supervisor sin departamento'], 400);

        // Obtener jefe de departamento
        $departmentHead = Employee::whereHas('contracts', function ($query) use ($supervisorDepartmentId) {
            $query->active()
                ->where('department_id', $supervisorDepartmentId)
                ->whereHas('position', function ($q) {
                    $q->whereIn('description', [
                        'Coordinador',
                        'Jefe de Departamento',
                        'Director',
                        'Vicerrector',
                        'Rector'
                    ]);
                });
        })->pluck('id')->first();

        // Query base
        $query = PerformanceEvaluation::with([
            'employee.person.identificationtype',
            'employee.contracts' => fn($q) => $q->active()->with('position'),
            'period'
        ])
            ->whereHas('status', fn($q) => $q->where('name', 'Completada'))
            ->where('department_id', $supervisorDepartmentId)
            ->when($departmentHead, fn($q) => $q->where('employee_id', '!=', $departmentHead));

        // Aplicar filtros
        if ($request->filled('search')) {
            $search = "%{$request->search}%";
            $query->whereHas('employee.person', fn($q) => $q
                ->where('identification_value', 'LIKE', $search)
                ->orWhere('first_name', 'LIKE', $search)
                ->orWhere('last_name', 'LIKE', $search));
        }

        if ($request->filled('period_id')) {
            $query->where('period_id', $request->period_id);
        }

        // Paginación
        $evaluations = $query->paginate($request->per_page ?? 6);

        // Transformar datos
        $transformed = $evaluations->getCollection()->map(function ($evaluation) {
            $activeContract = $evaluation->employee->contracts->firstWhere('status_id', 1);

            return [
                'evaluation_id' => $evaluation->id,
                'full_name' => $evaluation->employee->person->first_name . ' ' . $evaluation->employee->person->last_name,
                'identification' => $evaluation->employee->person->identificationtype->code . ' - ' . $evaluation->employee->person->identification_value,
                'position' => $activeContract->position->description ?? 'N/A',
                'total_score' => $evaluation->total_score,
                'period' => $evaluation->period->name,
                'evaluation_date' => $evaluation->created_at->format('d/m/Y')
            ];
        });

        return response()->json([
            'data' => $transformed,
            'total' => $evaluations->total(),
            'current_page' => $evaluations->currentPage(),
            'per_page' => $evaluations->perPage(),
            'last_page' => $evaluations->lastPage(),
            'periods' => EvaluationPeriod::all()
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
        try {
            $evaluation = PerformanceEvaluation::with([
                'employee.person.identificationType',
                'employee.contracts' => function ($query) {
                    $query->active()
                        ->with(['position', 'employmentType', 'department']);
                },
                'period',
                'response.question.sections'
            ])->findOrFail($id);
    
            // Get evaluated employee's active contract
            $activeContract = $evaluation->employee->contracts->firstWhere('status_id', 1);
            
            if (!$activeContract) {
                return response()->json(['message' => 'El empleado no tiene contrato activo'], 404);
            }
    
            // Get department from contract
            $department = $activeContract->department;
    
            // Find department head
            $departmentHead = Employee::whereHas('contracts', function ($query) use ($department) {
                $query->active()
                    ->where('department_id', $department->id)
                    ->whereHas('position', function ($q) {
                        $q->whereIn('description', [
                            'Coodinador',
                            'Jefe de Departamento',
                            'Director',
                            'Vicerrector',
                            'Rector'
                        ]);
                    });
            })->with('person')->first();
    
            // Structure sections and questions
            $groupedResponses = [];
            foreach ($evaluation->response as $response) {
                $section = $response->question->sections;
                if (!isset($groupedResponses[$section->id])) {
                    $groupedResponses[$section->id] = [
                        'section_id' => $section->id,
                        'section_name' => $section->name,
                        'questions' => []
                    ];
                }
    
                $groupedResponses[$section->id]['questions'][] = [
                    'question_id' => $response->question->id,
                    'question_text' => $response->question->question_text,
                    'score' => $response->score,
                    'comments' => $response->comments
                ];
            }
    
            $responseData = [
                'evaluated_employee' => [
                    'full_name' => $evaluation->employee->person->first_name . ' ' . $evaluation->employee->person->last_name,
                    'identification' => [
                        'type' => $evaluation->employee->person->identificationType->code,
                        'value' => $evaluation->employee->person->identification_value
                    ],
                    'department' => $department->name,
                    'employment_type' => $activeContract->employmentType->name ?? 'N/A',
                    'start_date' => $activeContract->start_date ?? 'N/A',
                    'position' => $activeContract->position->description ?? 'N/A'
                ],
                'evaluation_details' => [
                    'evaluator' => $departmentHead ? 
                        $departmentHead->person->first_name . ' ' . $departmentHead->person->last_name : 
                        'Not assigned',
                    'period' => $evaluation->period->name,
                    'total_score' => $evaluation->total_score,
                ],
                'sections' => array_values($groupedResponses),
                'rating_scale' => [
                    ['score' => 5, 'label' => 'Excelente'],
                    ['score' => 4, 'label' => 'Bueno'],
                    ['score' => 3, 'label' => 'Regular'],
                    ['score' => 2, 'label' => 'Muy Deficiente'],
                    ['score' => 1, 'label' => 'Deficiente']
                ]
            ];
    
            return response()->json([
                'data' => $responseData,
                'message' => 'Evaluación recuperada exitosamente'
            ]);
    
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Evaluacion no encontrada'], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al recuperar datos',
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
}
