<?php

namespace App\Traits;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

trait DashboardFilters
{
    protected function getDateRange($range, Request $request)
    {

        if ($range === 'custom' && $request->has(['start_date', 'end_date'])) {
            return [
                'start' => Carbon::parse($request->start_date),
                'end' => Carbon::parse($request->end_date)
            ];
        };
        
        return match($range) {
            'week' => [
                'start' => Carbon::now()->subWeek(),
                'end' => Carbon::now()
            ],
            'month' => [
                'start' => Carbon::now()->subMonth(),
                'end' => Carbon::now()
            ],
            'quarter' => [
                'start' => Carbon::now()->subQuarter(),
                'end' => Carbon::now()
            ],
            'year' => [
                'start' => Carbon::now()->subYear(),
                'end' => Carbon::now()
            ],
            default => [
                'start' => Carbon::now()->subMonth(),
                'end' => Carbon::now()
            ]
        };
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