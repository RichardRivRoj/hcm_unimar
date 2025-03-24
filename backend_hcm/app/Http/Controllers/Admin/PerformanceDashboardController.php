<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Ethnicity;
use App\Models\Gender;
use App\Models\Level;
use App\Models\PerformanceEvaluation;
use App\Models\Position;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class PerformanceDashboardController extends Controller
{
    public function performanceVsTenure(Request $request)
    {
        $departmentId = $request->input('department_id');

        $employees = Employee::active()
            ->with([
                'contracts' => fn($q) => $q->orderBy('start_date', 'asc'),
                'evaluations' => fn($q) => $q->latest()
            ])
            ->when($departmentId, function ($q) use ($departmentId) {
                $q->whereHas('currentDepartment', function ($q) use ($departmentId) {
                    // Especificar tabla departments.id
                    $q->where('departments.id', $departmentId);
                });
            })
            ->get();

        $data = $employees->map(function ($employee) {
            $firstContract = $employee->contracts->first();
            $latestEvaluation = $employee->evaluations->first();

            if (!$firstContract || !$latestEvaluation) return null;

            return [
                'employee' => $employee->full_name,
                'tenure' => Carbon::parse($firstContract->start_date)->diffInYears(now()),
                'score' => $latestEvaluation->total_score,
                'department_id' => $employee->currentDepartment->id ?? null,
                'department' => $employee->currentDepartment->name ?? 'Sin departamento'
            ];
        })->filter()->values();

        $correlation = $this->calculatePearsonCorrelation(
            $data->pluck('tenure')->all(),
            $data->pluck('score')->all()
        );

        return response()->json([
            'data' => $data,
            'correlation' => round($correlation, 2),
            'departments' => Department::withActiveEmployees()
                ->get(['id', 'name'])
                ->map(fn($d) => [
                    'value' => $d->id,
                    'label' => $d->name
                ])
        ]);
    }

    private function calculatePearsonCorrelation($x, $y)
    {
        if (count($x) !== count($y) || count($x) === 0) return 0;

        $n = count($x);
        $sumX = array_sum($x);
        $sumY = array_sum($y);
        $sumXY = 0;
        $sumX2 = 0;
        $sumY2 = 0;

        for ($i = 0; $i < $n; $i++) {
            $sumXY += ($x[$i] * $y[$i]);
            $sumX2 += ($x[$i] ** 2);
            $sumY2 += ($y[$i] ** 2);
        }

        $numerator = ($sumXY - ($sumX * $sumY) / $n);
        $denominatorX = $sumX2 - ($sumX ** 2) / $n;
        $denominatorY = $sumY2 - ($sumY ** 2) / $n;

        $denominator = sqrt($denominatorX * $denominatorY);

        if ($denominator == 0) {
            return 0; // Retornar 0 en lugar de causar un error
        }

        return $denominator != 0 ? $numerator / $denominator : 0;
    }

    public function goalCompliance(Request $request)
    {
        $goal = 75;
        $perPage = 5;
        $departmentId = $request->input('department_id');
        $positionId = $request->input('position_id');

        $evaluations = PerformanceEvaluation::with(['employee.currentContract.position'])
            ->whereHas('employee.currentContract', function ($q) use ($departmentId, $positionId) {
                $q->active();
                if ($departmentId) $q->where('department_id', $departmentId);
                if ($positionId) $q->where('position_id', $positionId);
            })
            ->get();

        $totalEvaluations = $evaluations->count();
        $totalCompliant = $evaluations->where('total_score', '>=', $goal)->count();
        $overallCompliance = $totalEvaluations > 0 ? ($totalCompliant / $totalEvaluations) * 100 : 0;

        $positions = collect();
        foreach ($evaluations->groupBy('employee.currentContract.position.id') as $positionId => $evals) {
            if (!$evals->first()->employee->currentContract?->position) continue;

            $position = $evals->first()->employee->currentContract->position;
            $total = $evals->count();
            $compliant = $evals->where('total_score', '>=', $goal)->count();

            $positions->push([
                'position' => $position->description,
                'total_evaluations' => $total,
                'compliant' => $compliant,
                'compliance_rate' => round(
                    ($total > 0)
                        ? ($compliant / $total) * 100
                        : 0,
                    2
                ),
                'average_score' => round($evals->avg('total_score'), 2)
            ]);
        }

        $paginated = new LengthAwarePaginator(
            $positions->forPage(LengthAwarePaginator::resolveCurrentPage(), $perPage),
            $positions->count(),
            $perPage,
            LengthAwarePaginator::resolveCurrentPage(),
            ['path' => $request->url()]
        );

        return response()->json([
            'overall' => [
                'total' => $totalEvaluations,
                'compliant' => $totalCompliant,
                'compliance_rate' => round($overallCompliance, 2),
                'goal' => $goal
            ],
            'positions' => $paginated,
            'filters' => [
                'departments' => Department::withActiveEmployees()
                    ->get(['id', 'name'])
                    ->map(fn($d) => [
                        'value' => $d->id,
                        'label' => $d->name
                    ]),
                'positions' => Position::has('contracts')->get(['id', 'description'])->map(fn($d) => [
                    'value' => $d->id,
                    'label' => $d->description,
                ]),
            ]
        ]);
    }

    public function diversityEvaluations(Request $request)
    {
        $demographicType = $request->input('demographic', 'gender'); // 'gender' o 'ethnicity'
        $validTypes = ['gender', 'ethnicity'];

        if (!in_array($demographicType, $validTypes)) {
            return response()->json(['error' => 'Tipo demográfico inválido'], 400);
        }

        $evaluations = PerformanceEvaluation::with([
            'employee.person.gender',
            'employee.person.ethnicity'
        ])
            ->whereHas('employee.person', function ($q) use ($demographicType) {
                $q->whereNotNull($demographicType . '_id');
            })
            ->get();

        $grouped = $evaluations->groupBy(function ($item) use ($demographicType) {
            return optional($item->employee->person->{$demographicType})->id;
        })->filter();

        $labels = [];
        $data = [];

        foreach ($grouped as $groupId => $group) {
            $demographic = $group->first()->employee->person->{$demographicType};
            if (!$demographic) continue;

            $labels[] = $demographic->name;
            $data[] = round($group->avg('total_score'), 2);
        }

        return response()->json([
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Puntuación Promedio',
                    'data' => $data,
                    'backgroundColor' => 'rgba(0, 73, 154, 0.2)',
                    'borderColor' => '#00499a'
                ]
            ],
            'demographic' => $demographicType,
            'filters' => [
                'ethnicities' => Ethnicity::all(['id', 'name'])->map(fn($d) => [
                    'value' => $d->id,
                    'label' => $d->name,
                ]),
                'genders' => Gender::all(['id', 'name'])->map(fn($d) => [
                    'value' => $d->id,
                    'label' => $d->name,
                ]),
            ]
        ]);
    }

    public function levelGapsAnalysis(Request $request)
    {
        // Obtener niveles y departamentos únicos
        $levels = Level::with('positions')->get(['id', 'name']);
        $departments = Department::has('evaluations')->get(['id', 'name']);

        // Obtener datos de evaluaciones
        $evaluations = PerformanceEvaluation::with([
            'department',
            'employee.currentContract.position.level'
        ])->get();

        // Estructurar datos para heatmap
        $heatmapData = [];
        foreach ($departments as $dept) {
            $row = ['department' => $dept->name];
            foreach ($levels as $level) {
                $avg = $evaluations
                    ->where('department_id', $dept->id)
                    ->filter(function ($eval) use ($level) {
                        return optional($eval->employee->currentContract->position)->level_id == $level->id;
                    })
                    ->avg('total_score');

                $row['levels'][$level->id] = round($avg ?: 0, 2);
            }
            $heatmapData[] = $row;
        }

        return response()->json([
            'heatmap' => $heatmapData,
            'levels' => $levels,
            'departments' => $departments,
            'colorScale' => [
                'min' => $evaluations->min('total_score') ?? 0,
                'max' => $evaluations->max('total_score') ?? 100
            ]
        ]);
    }
}
