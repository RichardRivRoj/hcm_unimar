<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AgendaResult;
use App\Models\Candidate;
use App\Models\Contract;
use App\Models\Employee;
use App\Models\Person;
use App\Models\Vacancy;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RecruitmentDashboardController extends Controller
{
    // KPI 1: Tiempo promedio de contratación
    public function averageHiringTime(Request $request)
    {
        $perPage = 5;
        $departments = $request->input('departments', []);

        $query = Vacancy::selectRaw('
        AVG(DATEDIFF(contracts.start_date, vacancies.created_at)) as average_days,
        departments.name as department
    ')
            ->join('candidates', 'vacancies.id', '=', 'candidates.vacancy_id')
            ->join('employees', 'candidates.person_id', '=', 'employees.person_id')
            ->join('contracts', 'employees.id', '=', 'contracts.employee_id')
            ->join('departments', 'vacancies.department_id', '=', 'departments.id')
            ->groupBy('departments.name');

        if (!empty($departments)) {
            $query->whereIn('departments.id', $departments);
        }

        $data = $query->paginate($perPage);

        return response()->json([
            'data' => $data->items(),
            'meta' => [
                'current_page' => $data->currentPage(),
                'total_pages' => $data->lastPage(),
                'total_items' => $data->total(),
            ]
        ]);
    }

    // KPI 2: Tasa de conversión de candidatos
    public function conversionRate()
    {
        $totalCandidates = Candidate::count();

        // Obtener candidatos contratados a través de empleados
        $hiredCandidates = Employee::whereHas('contracts')->count();

        return response()->json([
            'total_candidates' => $totalCandidates,
            'hired' => $hiredCandidates,
            'conversion_rate' => $totalCandidates > 0
                ? round(($hiredCandidates / $totalCandidates) * 100, 2)
                : 0
        ]);
    }

    public function interviewRatio(Request $request)
    {
        $query = Vacancy::select(
            'department_id',
            DB::raw('COUNT(DISTINCT vacancies.id) as total_vacancies'), // Vacantes únicas
            DB::raw('COUNT(agendas.id) as total_interviews') // Total entrevistas
        )
            ->leftJoin('candidates', 'vacancies.id', '=', 'candidates.vacancy_id')
            ->leftJoin('agendas', 'candidates.id', '=', 'agendas.candidate_id')
            ->with('department')
            ->groupBy('department_id');

        // Aplicar filtros
        if ($request->date_from && $request->date_to) {
            $query->whereBetween('agendas.scheduled_date', [
                $request->date_from,
                $request->date_to
            ]);
        }

        if ($request->department_id) {
            $query->where('department_id', $request->department_id);
        }

        $departments = $query->paginate($request->per_page ?? 10);

        // Cálculo total CORRECTO
        $total = [
            'total_vacancies' => $departments->sum('total_vacancies'),
            'total_interviews' => $departments->sum('total_interviews'),
            'global_ratio' => $departments->sum('total_interviews') / max($departments->sum('total_vacancies'), 1)
        ];

        return response()->json([
            'data' => $departments->map(function ($item) {
                return [
                    'department' => $item->department->name,
                    'total_vacancies' => $item->total_vacancies,
                    'total_interviews' => $item->total_interviews,
                    'ratio' => $item->total_interviews / max($item->total_vacancies, 1)
                ];
            }),
            'total' => $total,
            'meta' => [
                'pagination' => $departments->toArray()
            ]
        ]);
    }

    // KPI 3: Ratio entrevistas por vacante
    public function interviewsPerVacancy()
    {
        $data = Vacancy::selectRaw('
        vacancies.description as vacancy_name, // Cambiar title por name
        COUNT(agendas.id) as total_interviews,
        COUNT(DISTINCT candidates.id) as total_candidates
    ')
            ->leftJoin('candidates', 'vacancies.id', '=', 'candidates.vacancy_id')
            ->leftJoin('agendas', 'candidates.id', '=', 'agendas.candidate_id')
            ->groupBy('vacancies.id', 'vacancies.name') // Agrupar por name
            ->get();

        return response()->json($data);
    }

    // KPI 4: Retención a 6 meses
    public function sixMonthRetention()
    {
        $sixMonthsAgo = Carbon::now()->subMonths(6);

        $totalHires = Contract::where('start_date', '<=', $sixMonthsAgo)->count();
        $activeHires = Contract::where('start_date', '<=', $sixMonthsAgo)
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>', Carbon::now());
            })
            ->count();

        return response()->json([
            'total_hires' => $totalHires,
            'active_hires' => $activeHires,
            'retention_rate' => $totalHires > 0
                ? round(($activeHires / $totalHires) * 100, 2)
                : 0
        ]);
    }

    // KPI 5: Desempeño inicial promedio
    public function averageInitialPerformance()
    {
        $data = AgendaResult::selectRaw('
            AVG(score) as average_score,
            type_agendas.name as evaluation_type
        ')
            ->join('agendas', 'agenda_results.agenda_id', '=', 'agendas.id')
            ->join('type_agendas', 'agendas.type_agenda_id', '=', 'type_agendas.id')
            ->groupBy('type_agendas.name')
            ->get();

        return response()->json($data);
    }

    // KPI 6: Vacantes por estado y departamento
    public function vacanciesAnalysis()
    {
        $data = Vacancy::selectRaw('
            statuses.name as status,
            departments.name as department,
            COUNT(*) as total
        ')
            ->join('statuses', 'vacancies.status_id', '=', 'statuses.id')
            ->join('departments', 'vacancies.department_id', '=', 'departments.id')
            ->groupBy('statuses.name', 'departments.name')
            ->get();

        return response()->json($data);
    }

    // KPI 7: Diversidad de candidatos
    public function diversityStats()
    {
        $genderStats = Person::selectRaw('
            genders.name as gender,
            COUNT(*) as total
        ')
            ->join('genders', 'persons.gender_id', '=', 'genders.id')
            ->join('candidates', 'persons.id', '=', 'candidates.person_id')
            ->groupBy('genders.name')
            ->get();

        $ethnicityStats = Person::selectRaw('
            ethnicities.name as ethnicity,
            COUNT(*) as total
        ')
            ->join('ethnicities', 'persons.ethnicity_id', '=', 'ethnicities.id')
            ->join('candidates', 'persons.id', '=', 'candidates.person_id')
            ->groupBy('ethnicities.name')
            ->get();

        return response()->json([
            'gender' => $genderStats,
            'ethnicity' => $ethnicityStats
        ]);
    }
}
