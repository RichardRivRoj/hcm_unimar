<?php

namespace App\Observers;

use App\Models\EvaluationPeriod;
use App\Models\Status;
use Carbon\Carbon;

class EvaluationPeriodObserver
{
    public function saving(EvaluationPeriod $period)
    {
        $now = Carbon::now();

        // Obtener estados
        $activeStatus = Status::firstOrCreate(['name' => 'Activo']);
        $inactiveStatus = Status::firstOrCreate(['name' => 'Inactivo']);

        // Determinar estado basado en fechas
        if ($period->start_date <= $now && $period->end_date >= $now) {
            $period->status_id = $activeStatus->id;

            // Desactivar otros períodos activos
            EvaluationPeriod::where('id', '!=', $period->id)
                ->where('status_id', $activeStatus->id)
                ->update(['status_id' => $inactiveStatus->id]);
        } else {
            $period->status_id = $inactiveStatus->id;
        }
    }
}
