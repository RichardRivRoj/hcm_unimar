<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\Ethnicity;
use App\Models\Gender;
use App\Models\MaritalStatus;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PersonnelDashboardController extends Controller
{
    public function demographicDiversity(Request $request)
    {
        $timeRange = $request->input('time_range', 'all_time');
        $startDate = $this->calculateStartDate($timeRange);

        // Filtrar solo personas que son empleados (activos o inactivos)
        $query = Person::query()->whereHas('employee') // <-- Aquí el filtro clave
            ->when($startDate, function ($q) use ($startDate) {
                $q->where('created_at', '>=', $startDate);
            });

        // Resto del código se mantiene igual...
        $genderData = $this->getDemographicData($query, 'gender_id', Gender::class);
        $ethnicityData = $this->getDemographicData($query, 'ethnicity_id', Ethnicity::class);
        $countryData = $this->getDemographicData($query, 'countries_id', Country::class);

        // KPI 2: Distribución por Estado Civil
        $maritalStatusData = $this->getMaritalData($query, 'marital_status_id', MaritalStatus::class);

        // KPI 3: Pirámide Generacional
        $agePyramidData = $this->getAgePyramidData($query);

        // KPI 4: Distribución por Nivel
        $levelDistribution = $this->getLevelDistributionData($query);

        return response()->json([
            'gender' => $genderData,
            'ethnicity' => $ethnicityData,
            'country' => $countryData,
            'marital_status' => $maritalStatusData, // Nuevo KPI
            'age_pyramid' => $agePyramidData,
            'level_distribution' => $levelDistribution,
            'filters' => [
                'time_ranges' => $this->getTimeRanges()
            ]
        ]);
    }

    private function getDemographicData($query, $foreignKey, $model)
    {
        $data = clone $query;
        return $data->select($foreignKey, DB::raw('COUNT(*) as count'))
            ->with([str_replace('_id', '', $foreignKey)]) // Eager load relacion
            ->groupBy($foreignKey)
            ->get()
            ->map(function ($item) use ($foreignKey, $model) {
                $relation = str_replace('_id', '', $foreignKey);
                return [
                    'label' => optional($item->$relation)->name ?? 'No especificado',
                    'count' => $item->count
                ];
            });
    }

    private function getMaritalData($query, $foreignKey, $model)
    {
        $data = clone $query;
        $results = $data->select($foreignKey, DB::raw('COUNT(*) as count'))
            ->with([str_replace('_id', '', $foreignKey)])
            ->groupBy($foreignKey)
            ->get();

        $total = $results->sum('count'); // Calcular total

        return $results->map(function ($item) use ($foreignKey, $model, $total) {
            $relation = str_replace('_id', '', $foreignKey);
            return [
                'label' => optional($item->$relation)->name ?? 'No especificado',
                'count' => $item->count,
                'percentage' => $total > 0 ? round(($item->count / $total) * 100, 2) : 0 // Nuevo campo
            ];
        });
    }

    private function getAgePyramidData($query)
    {
        $currentYear = now()->year;

        $data = clone $query;
        return $data->select(
            DB::raw("CONCAT(
                FLOOR(($currentYear - YEAR(birth_date)) / 10) * 10, 
                '-', 
                FLOOR(($currentYear - YEAR(birth_date)) / 10) * 10 + 9
            ) as age_range"),
            'gender_id',
            DB::raw('COUNT(*) as count')
        )
            ->whereNotNull('birth_date')
            ->groupBy('age_range', 'gender_id')
            ->orderBy('age_range')
            ->get()
            ->groupBy('age_range')
            ->map(function ($group) {
                return [
                    'range' => $group->first()->age_range,
                    'male' => $group->where('gender_id', 1)->sum('count'), // Ajustar IDs según tu DB
                    'female' => $group->where('gender_id', 2)->sum('count'),
                    'total' => $group->sum('count')
                ];
            })
            ->values();
    }

    private function getLevelDistributionData($query)
    {
        $data = clone $query;

        return $data->with(['employee.contracts' => function ($q) {
            $q->active()->with(['position.level']);
        }])
            ->get()
            ->flatMap(function ($person) {
                return $person->employee->contracts->map(function ($contract) {
                    return [
                        'level' => optional(optional($contract->position)->level)->name ?? 'Sin Nivel',
                        'position' => optional($contract->position)->description ?? 'Sin Posición'
                    ];
                });
            })
            ->groupBy('level')
            ->map(function ($group, $level) {
                $total = $group->count();

                return [
                    'name' => $level,
                    'value' => $total,
                    'children' => $group->groupBy('position')->map(function ($subGroup, $position) use ($total) {
                        return [
                            'name' => $position,
                            'value' => round(($subGroup->count() / $total) * 100, 2)
                        ];
                    })->values()
                ];
            })
            ->values();
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
