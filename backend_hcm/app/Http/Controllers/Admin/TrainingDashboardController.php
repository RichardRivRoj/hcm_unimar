<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompletionStatus;
use App\Models\Department;
use App\Models\EmployeeTrainingEnrollment;
use App\Models\PerformanceEvaluation;
use App\Models\Status;
use App\Models\TrainingProgram;
use App\Models\TrainingType;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class TrainingDashboardController extends Controller
{
    public function trainingParticipation(Request $request)
    {
        $departmentId = $request->input('department_id');
        $timeRange = $request->input('time_range', 'all_time');
        $page = $request->input('page', 1);
        $perPage = 5;

        // Calcular fecha inicial según el rango
        $startDate = now();
        switch ($timeRange) {
            case 'last_week':
                $startDate = now()->subWeek();
                break;
            case 'last_month':
                $startDate = now()->subMonth();
                break;
            case 'last_semester':
                $startDate = now()->subMonths(6);
                break;
            case 'last_year':
                $startDate = now()->subYear();
                break;
            case 'all_time':
            default:
                $startDate = null;
        }

        $baseQuery = Department::query()
            ->when($departmentId, function ($q) use ($departmentId) {
                $q->where('id', $departmentId);
            });

        // Contar empleados activos e inscritos con filtro temporal
        $departments = $baseQuery->withCount([
            'activeEmployees',
            'activeEmployees as enrolled_count' => function ($q) use ($startDate) {
                $q->whereHas('trainingEnrollments', function ($q) use ($startDate) {
                    if ($startDate) {
                        $q->where('enrollment_date', '>=', $startDate);
                    }
                });
            }
        ])->get();

        // Procesar y ordenar departamentos
        $processed = $departments->map(function ($dept) {
            $rate = $dept->active_employees_count > 0
                ? ($dept->enrolled_count / $dept->active_employees_count) * 100
                : 0;

            return [
                'department_id' => $dept->id,
                'department_name' => $dept->name,
                'enrolled' => $dept->enrolled_count,
                'total_employees' => $dept->active_employees_count,
                'participation_rate' => round($rate, 2)
            ];
        })
            ->sortByDesc('participation_rate')
            ->values(); // Reinicia índices a numéricos secuenciales;

        // Paginación manual
        $paginated = new \Illuminate\Pagination\LengthAwarePaginator(
            $processed->forPage($page, $perPage)->values(),
            $processed->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        // Totales generales
        $totalEnrolled = $processed->sum('enrolled');
        $totalActive = $processed->sum('total_employees');
        $participationRate = $totalActive > 0 ? ($totalEnrolled / $totalActive) * 100 : 0;

        return response()->json([
            'overall' => [
                'enrolled' => $totalEnrolled,
                'total_employees' => $totalActive,
                'participation_rate' => round($participationRate, 2)
            ],
            'by_department' => $paginated,
            'filters' => [
                'departments' => Department::get(['id', 'name'])->map(fn($d) => [
                    'value' => $d->id,
                    'label' => $d->name
                ]),
                'time_ranges' => [
                    ['value' => 'all_time', 'label' => 'Todo el tiempo'],
                    ['value' => 'last_week', 'label' => 'Última semana'],
                    ['value' => 'last_month', 'label' => 'Último mes'],
                    ['value' => 'last_semester', 'label' => 'Último semestre'],
                    ['value' => 'last_year', 'label' => 'Último año'],
                ]
            ]
        ]);
    }

    public function programCompletionRate(Request $request)
    {
        $departmentId = $request->input('department_id');
        $timeRange = $request->input('time_range', 'all_time');

        // Calcular rango de fechas
        $startDate = $this->calculateStartDate($timeRange);

        $query = EmployeeTrainingEnrollment::with(['completion', 'employee.department'])
            ->when($startDate, function ($q) use ($startDate) {
                $q->where('enrollment_date', '>=', $startDate);
            })
            ->when($departmentId, function ($q) use ($departmentId) {
                $q->whereHas('employee.currentDepartment', function ($q) use ($departmentId) {
                    $q->where('departments.id', $departmentId);
                });
            });

        // Obtener totales por estado
        $statusCounts = $query->selectRaw('count(*) as total, completion_status_id')
            ->groupBy('completion_status_id')
            ->get()
            ->keyBy('completion_status_id');

        // Obtener todos los estados posibles
        $allStatuses = CompletionStatus::get(['id', 'name']);

        // Calcular métricas
        $totalEnrollments = $query->count();
        $completed = $allStatuses->firstWhere('name', 'Completado') ?
            ($statusCounts[$allStatuses->firstWhere('name', 'Completado')->id]->total ?? 0) : 0;

        $completionRate = $totalEnrollments > 0
            ? ($completed / $totalEnrollments) * 100
            : 0;

        // Estructurar datos para gráfico
        $statusData = $allStatuses->map(function ($status) use ($statusCounts) {
            return [
                'status_id' => $status->id,
                'status_name' => $status->name,
                'count' => $statusCounts[$status->id]->total ?? 0
            ];
        });

        return response()->json([
            'overall' => [
                'total_enrollments' => $totalEnrollments,
                'completed' => $completed,
                'completion_rate' => round($completionRate, 2)
            ],
            'by_status' => $statusData,
            'filters' => [
                'time_ranges' => $this->getTimeRanges()
            ]
        ]);
    }

    public function averageScores(Request $request)
    {
        $departmentId = $request->input('department_id');
        $timeRange = $request->input('time_range', 'all_time');

        // Calcular rango de fechas
        $startDate = $this->calculateStartDate($timeRange);

        // Query base reutilizable
        $baseQuery = EmployeeTrainingEnrollment::whereNotNull('score')
            ->when($startDate, fn($q) => $q->where('enrollment_date', '>=', $startDate))
            ->when($departmentId, fn($q) => $q->whereHas(
                'employee.currentDepartment',
                fn($q) => $q->where('departments.id', $departmentId)
            ));

        // Calcular promedio
        $averageScore = $baseQuery->avg('score') ?? 0;

        // Query específica para distribución
        $distributionQuery = clone $baseQuery;
        $scoreDistribution = $distributionQuery->selectRaw('
        CASE
            WHEN score BETWEEN 0 AND 20 THEN "0-20"
            WHEN score BETWEEN 21 AND 40 THEN "21-40"
            WHEN score BETWEEN 41 AND 60 THEN "41-60"
            WHEN score BETWEEN 61 AND 80 THEN "61-80"
            WHEN score BETWEEN 81 AND 100 THEN "81-100"
            ELSE "Sin calificar"
        END as score_range,
        COUNT(*) as count
    ')->groupBy('score_range')->get();

        return response()->json([
            'overall' => [
                'average_score' => round($averageScore, 1),
                'total_graded' => $baseQuery->count()
            ],
            'distribution' => $scoreDistribution,
            'filters' => [
                'time_ranges' => $this->getTimeRanges()
            ]
        ]);
    }

    public function activeProgramsByType(Request $request)
    {
        $trainingTypeId = $request->input('training_type_id');
        $timeRange = $request->input('time_range', 'all_time');
        $page = $request->input('page', 1);
        $perPage = 5;

        $startDate = $this->calculateStartDate($timeRange);

        $query = TrainingProgram::join('training_types', 'training_programs.training_type_id', '=', 'training_types.id')
            ->where('training_programs.status_id', Status::ACTIVE)
            ->selectRaw('
            training_types.id as type_id,
            training_types.name as type_name,
            COUNT(*) as count
        ')
            ->groupBy('training_types.id', 'training_types.name')
            ->when($startDate, function ($q) use ($startDate) {
                $q->where('training_programs.start_date', '>=', $startDate);
            })
            ->when($trainingTypeId, function ($q) use ($trainingTypeId) {
                $q->where('training_programs.training_type_id', $trainingTypeId);
            });

        $results = $query->get();

        $paginated = new LengthAwarePaginator(
            $results->forPage($page, $perPage),
            $results->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return response()->json([
            'overall' => [
                'total_active' => $results->sum('count'),
            ],
            'by_type' => $paginated,
            'filters' => [
                'training_types' => TrainingType::all(['id', 'name'])->map(fn($t) => [
                    'value' => $t->id,
                    'label' => $t->name
                ]),
                'time_ranges' => $this->getTimeRanges()
            ]
        ]);
    }
    public function evaluationImpact(Request $request)
    {
        $timeRange = $request->input('time_range', 'all_time');
        $startDate = $this->calculateStartDate($timeRange);
    
        // Obtener primera fecha de capacitación por empleado
        $trainingsSubquery = EmployeeTrainingEnrollment::where('completion_status_id', CompletionStatus::COMPLETED)
            ->join('training_programs', 'employee_training_enrollments.training_program_id', '=', 'training_programs.id')
            ->select('employee_id', DB::raw('MIN(end_date) as first_training_end'))
            ->groupBy('employee_id');
    
        // Evaluaciones post-capacitación
        $postTraining = PerformanceEvaluation::with(['period'])
            ->selectRaw('
                evaluation_periods.start_date as period_date,
                ROUND(AVG(total_score), 2) as avg_score
            ')
            ->join('evaluation_periods', 'performance_evaluations.period_id', '=', 'evaluation_periods.id')
            ->joinSub($trainingsSubquery, 'trainings', function ($join) {
                $join->on('performance_evaluations.employee_id', '=', 'trainings.employee_id');
            })
            ->where('evaluation_periods.start_date', '>=', DB::raw('trainings.first_training_end'))
            ->when($startDate, function ($q) use ($startDate) {
                $q->where('evaluation_periods.start_date', '>=', $startDate);
            })
            ->groupBy('evaluation_periods.start_date')
            ->orderBy('evaluation_periods.start_date')
            ->get();
    
        // Evaluaciones históricas (pre-capacitación)
        $preTraining = PerformanceEvaluation::with(['period'])
            ->selectRaw('
                evaluation_periods.start_date as period_date,
                ROUND(AVG(total_score), 2) as avg_score
            ')
            ->join('evaluation_periods', 'performance_evaluations.period_id', '=', 'evaluation_periods.id')
            ->leftJoinSub($trainingsSubquery, 'trainings', function ($join) {
                $join->on('performance_evaluations.employee_id', '=', 'trainings.employee_id');
            })
            ->where(function ($q) {
                $q->where('evaluation_periods.start_date', '<', DB::raw('trainings.first_training_end'))
                  ->orWhereNull('trainings.first_training_end');
            })
            ->when($startDate, function ($q) use ($startDate) {
                $q->where('evaluation_periods.start_date', '>=', $startDate);
            })
            ->groupBy('evaluation_periods.start_date')
            ->orderBy('evaluation_periods.start_date')
            ->get();
    
        // Formatear fechas y unificar períodos
        $formatDate = fn($date) => Carbon::parse($date)->format('Y-m');

        $postTraining->transform(fn($item) => [
            'period' => $formatDate($item->period), // Acceder a través de la relación
            'avg_score' => $item->avg_score
        ]);
        
        $preTraining->transform(fn($item) => [
            'period' => $formatDate($item->period),
            'avg_score' => $item->avg_score
        ]);
    
        $labels = collect()
            ->merge($postTraining->pluck('period'))
            ->merge($preTraining->pluck('period'))
            ->unique()
            ->sort()
            ->values();
    
        return response()->json([
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Post-Capacitación',
                    'data' => $labels->map(fn($p) => $postTraining->firstWhere('period', $p)['avg_score'] ?? 0),
                    'borderColor' => '#004B9A',
                    'tension' => 0.3
                ],
                [
                    'label' => 'Histórico',
                    'data' => $labels->map(fn($p) => $preTraining->firstWhere('period', $p)['avg_score'] ?? 0),
                    'borderColor' => '#B0BEC5',
                    'tension' => 0.3
                ]
            ],
            'filters' => [
                'time_ranges' => $this->getTimeRanges()
            ]
        ]);
    }

    private function calculateStartDate($timeRange)
    {
        switch ($timeRange) {
            case 'last_week':
                return now()->subWeek();
            case 'last_month':
                return now()->subMonth();
            case 'last_semester':
                return now()->subMonths(6);
            case 'last_year':
                return now()->subYear();
            default:
                return null;
        }
    }

    private function getTimeRanges()
    {
        return [
            ['value' => 'all_time', 'label' => 'Todo el tiempo'],
            ['value' => 'last_week', 'label' => 'Última semana'],
            ['value' => 'last_month', 'label' => 'Último mes'],
            ['value' => 'last_semester', 'label' => 'Último semestre'],
            ['value' => 'last_year', 'label' => 'Último año'],
        ];
    }
}
