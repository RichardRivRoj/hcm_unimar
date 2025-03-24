<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AgendaResult;
use App\Models\Candidate;
use App\Models\Contract;
use App\Models\Employee;
use App\Models\Person;
use App\Models\Status;
use App\Models\StatusApplication;
use App\Models\Vacancy;
use App\Traits\DashboardFilters;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class RecruitmentDashboardController extends Controller
{
    use DashboardFilters;

    // Método único para manejar filtros comunes
    protected function applyCommonFilters($query, Request $request)
    {
        // Filtro por departamento
        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        // Filtro temporal
        if ($request->has('time_range')) {
            $dates = $this->getDateRange($request->time_range);
            $query->whereBetween('created_at', [$dates['start'], $dates['end']]);
        }

        // Eliminar ordenamiento por defecto
        if ($request->has('sort_by')) {
            $query->orderByDesc($request->sort_by);
        }

        return $query;
    }

    // KPI 1: Tiempo promedio de contratación (Estandarizado)
    public function averageHiringTime(Request $request)
    {
        $baseQuery = Vacancy::selectRaw('
        AVG(DATEDIFF(contracts.start_date, vacancies.created_at)) as average_days,
        departments.name as department,
        departments.id as department_id
    ')
            ->joinRelatedTables()
            ->groupBy('departments.id', 'departments.name') // Agrupar por ambos campos
            ->orderByDesc('average_days'); // Ordenar solo por el alias

        $query = $this->applyCommonFilters($baseQuery, $request)
            ->when(!$request->show_all, fn($q) => $q->limit(5));

        $result = $this->paginateResults($query, $request);

        return response()->json([
            'data' => $result->items(),
            'meta' => $this->buildMeta($result)
        ]);
    }

    // KPI 2: Tasa de conversión con filtros
    public function conversionRate(Request $request)
    {
        $query = Candidate::query()
            ->selectRaw('
            COUNT(*) as total_candidates,
            SUM(
                CASE WHEN employees.id IS NOT NULL 
                AND contracts.id IS NOT NULL THEN 1 ELSE 0 
                END
            ) as hired
        ')
            ->leftJoin('employees', 'candidates.person_id', '=', 'employees.person_id')
            ->leftJoin('contracts', 'employees.id', '=', 'contracts.employee_id');

        // Aplicar filtros sin paginación
        $this->applyCommonFilters($query, $request);

        $result = $query->first();

        return response()->json([
            'data' => [
                'total_candidates' => $result->total_candidates ?? 0,
                'hired' => $result->hired ?? 0,
                'conversion_rate' => $result->total_candidates > 0
                    ? round(($result->hired / $result->total_candidates) * 100, 2)
                    : 0
            ]
        ]);
    }

    // KPI 3: Ratio entrevistas por vacante (Estandarizado)
    public function interviewRatio(Request $request)
    {
        $query = Vacancy::select([
            'department_id',
            DB::raw('COUNT(DISTINCT vacancies.id) as total_vacancies'),
            DB::raw('COUNT(agendas.id) as total_interviews')
        ])
            ->leftJoinRelatedCandidates()
            ->leftJoinRelatedAgendas()
            ->groupBy('department_id');

        // Ordenamiento por ratio calculado
        $query->orderByDesc(DB::raw('total_interviews/total_vacancies'));

        $result = $this->applyCommonFilters($query, $request)
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'data' => $result->items(),
            'meta' => $this->buildMeta($result),
            'metrics' => [
                'global_ratio' => $result->sum('total_interviews') / max($result->sum('total_vacancies'), 1)
            ]
        ]);
    }

    public function activeVacancies(Request $request)
    {
        $query = Vacancy::select([
            'department_id',
            DB::raw('COUNT(*) as total_active_vacancies')
        ])
            ->where('status_id', Status::ACTIVE) // Asumiendo constante ACTIVE=1
            ->with('department')
            ->groupBy('department_id');

        $query = $this->applyCommonFilters($query, $request);

        $result = $query->paginate($request->per_page ?? 5);

        return response()->json([
            'data' => $result->items(),
            'meta' => $this->buildMeta($result),
            'metrics' => [
                'global_total' => $result->sum('total_active_vacancies')
            ]
        ]);
    }

    public function initialPerformance(Request $request)
    {
        $query = AgendaResult::select([
            'departments.id as department_id',
            DB::raw('AVG(agenda_results.score) as average_score')
        ])
            ->join('agendas', 'agenda_results.agenda_id', '=', 'agendas.id')
            ->join('candidates', 'agendas.candidate_id', '=', 'candidates.id')
            ->join('vacancies', 'candidates.vacancy_id', '=', 'vacancies.id')
            ->join('departments', 'vacancies.department_id', '=', 'departments.id')
            ->groupBy('departments.id');

        $query = $this->applyCommonFilters($query, $request);

        $result = $query->paginate($request->per_page ?? 5);

        return response()->json([
            'data' => $result->items(),
            'meta' => $this->buildMeta($result)
        ]);
    }

    // KPI 6: Distribución de vacantes por estado
    public function vacancyStatusDistribution(Request $request)
    {
        $query = Vacancy::select([
            'status_id',
            DB::raw('COUNT(*) as total'),
            'statuses.name as status_name'
        ])
            ->join('statuses', 'vacancies.status_id', '=', 'statuses.id')
            ->groupBy('status_id', 'statuses.name');

        $result = $this->applyCommonFilters($query, $request)
            ->paginate($request->per_page ?? 5);

        return response()->json([
            'data' => $result->items(),
            'meta' => $this->buildMeta($result),
            'metrics' => [
                'total_vacancies' => $result->sum('total')
            ]
        ]);
    }

    // KPI 7: Distribución de candidatos por género
    public function candidateGenderDistribution(Request $request)
    {
        // 1. Obtener el ID del estado "Contratado"
        $hiredStatusId = StatusApplication::where('name', 'Contratado')
            ->value('id');

        // 2. Construir query base
        $query = Person::select([
            'gender_id',
            DB::raw('COUNT(*) as total'),
            'genders.name as gender'
        ])
            ->join('candidates', 'persons.id', '=', 'candidates.person_id')
            ->join('genders', 'persons.gender_id', '=', 'genders.id');

        // 3. Excluir contratados solo si existe el estado
        if ($hiredStatusId) {
            $query->where('candidates.status_application_id', '!=', $hiredStatusId);
        }

        // 4. Aplicar filtros comunes
        $query = $this->applyCommonFilters($query, $request)
            ->groupBy('gender_id', 'genders.name');

        $result = $query->paginate($request->per_page ?? 5);

        return response()->json([
            'data' => $result->items(),
            'meta' => $this->buildMeta($result),
            'metrics' => [
                'total_candidates' => $result->sum('total')
            ]
        ]);
    }
}
