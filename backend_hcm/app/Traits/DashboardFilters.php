<?php

namespace App\Traits;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

trait DashboardFilters
{
    protected function getDateRange($timeRange, $referenceDate = null)
    {
        $referenceDate = $referenceDate ?: Carbon::now();

        switch ($timeRange) {
            case 'last_week':
                return [
                    'start' => $referenceDate->copy()->subWeek(),
                    'end' => $referenceDate
                ];
            case 'last_month':
                return [
                    'start' => $referenceDate->copy()->subMonth(),
                    'end' => $referenceDate
                ];
            case 'last_semester':
                return [
                    'start' => $referenceDate->copy()->subMonths(6),
                    'end' => $referenceDate
                ];
            case 'last_year':
                return [
                    'start' => $referenceDate->copy()->subYear(),
                    'end' => $referenceDate
                ];
            default: // 'all_time'
                return [
                    'start' => Carbon::create(2000, 1, 1),
                    'end' => $referenceDate
                ];
        }
    }

    protected function paginateResults(Builder $query, Request $request)
    {
        return $query->paginate(
            $request->per_page ?? 5,
            ['*'],
            'page',
            $request->page ?? 1
        );
    }

    protected function buildMeta($paginator)
    {
        return [
            'current_page' => $paginator->currentPage(),
            'total_pages' => $paginator->lastPage(),
            'total_items' => $paginator->total(),
            'per_page' => $paginator->perPage(),
            'time_range' => request()->time_range ?? 'last_30_days',
            'filters' => request()->except(['page', 'per_page'])
        ];
    }
}
