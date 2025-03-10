<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEvaluationPeriodRequest;
use App\Http\Requests\Admin\UpdateEvaluationPeriodRequest;
use App\Models\EvaluationPeriod;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EvaluationPeriodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = EvaluationPeriod::with('status')
            ->orderBy('start_date', 'desc');

        // Filtro por estatus
        if ($request->has('status_id') && $request->input('status_id') != '') {
            $query->where('status_id', $request->input('status_id'));
        }

        // Filtro por período (activos, pasados, futuros)
        if ($request->has('period') && $request->input('period') != '') {
            $now = now()->format('Y-m-d');

            switch ($request->input('period')) {
                case 'active':
                    $query->where('start_date', '<=', $now)
                        ->where('end_date', '>=', $now);
                    break;

                case 'past':
                    $query->where('end_date', '<', $now);
                    break;

                case 'future':
                    $query->where('start_date', '>', $now);
                    break;
            }
        }

        $perPage = $request->has('per_page') ? $request->input('per_page') : 5;
        $periods = $query->paginate($perPage);

        return response()->json([
            'data' => $periods->items(),
            'meta' => [
                'current_page' => $periods->currentPage(),
                'last_page' => $periods->lastPage(),
                'total' => $periods->total(),
                'per_page' => $periods->perPage(),
            ]
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
    public function store(StoreEvaluationPeriodRequest $request)
    {
        $data = $request->validated();

        DB::beginTransaction();

        try {
            $lastPeriod = EvaluationPeriod::orderBy('end_date', 'desc')->first();

            if ($lastPeriod && $data['start_date'] <= $lastPeriod->end_date) {
                DB::rollBack();
                return response()->json([
                    'message' => 'El nuevo período debe comenzar después del último período existente (' . $lastPeriod->end_date . ')'
                ], 422);
            }

            // Obtener estados
            $activeStatus = Status::firstOrCreate(
                ['name' => 'Activo'],
            );

            $inactiveStatus = Status::firstOrCreate(
                ['name' => 'Inactivo'],
            );

            // Asignar estado automáticamente
            $data['status_id'] = EvaluationPeriod::where('status_id', $activeStatus->id)->exists()
                ? $inactiveStatus->id
                : $activeStatus->id;

            $period = EvaluationPeriod::create($data);

            DB::commit();

            return response()->json([
                'message' => 'Período creado exitosamente',
                'data' => $period->load('status')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al crear período: ' . $e->getMessage());

            return response()->json([
                'message' => 'Error al procesar la solicitud',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {}

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
        DB::beginTransaction();

        try {
            // Buscar el período por ID
            $period = EvaluationPeriod::find($id);

            // Verificar si el período existe
            if (!$period) {
                return response()->json([
                    'message' => 'Período no encontrado'
                ], 404);
            }

            // Validar los datos de entrada
            $validated = $request->validate([
                'name' => 'nullable|max:255|unique:evaluation_periods,name,' . $period->id,
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
            ]);

            // Validar solapamiento de fechas excluyendo el período actual
            $overlappingPeriod = EvaluationPeriod::where('id', '!=', $period->id)
                ->where(function ($query) use ($validated) {
                    $query->where(function ($q) use ($validated) {
                        $q->where('start_date', '<=', $validated['end_date'])
                            ->where('end_date', '>=', $validated['start_date']);
                    });
                })->first();

            if ($overlappingPeriod) {
                return response()->json([
                    'message' => 'El período se solapa con: ' . $overlappingPeriod->name
                ], 422);
            }

            // Actualizar solo los campos proporcionados
            $period->update($validated);

            DB::commit();

            return response()->json([
                'message' => 'Período actualizado exitosamente',
                'data' => $period->fresh()->load('status')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error actualizando período: ' . $e->getMessage());

            return response()->json([
                'message' => 'Error al actualizar el período',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        DB::beginTransaction();

        try {
            // Buscar el período por ID
            $period = EvaluationPeriod::find($id);

            // Verificar si el período existe
            if (!$period) {
                return response()->json([
                    'message' => 'Período no encontrado'
                ], 404);
            }

            // Cargar la relación de estado si no está cargada
            if (!$period->relationLoaded('status')) {
                $period->load('status');
            }

            // Verificar si el estado existe
            if (!$period->status) {
                return response()->json([
                    'message' => 'Estado del período no encontrado'
                ], 404);
            }

            // No permitir eliminar períodos activos
            if ($period->status->name === 'Activo') {
                return response()->json([
                    'message' => 'No se puede eliminar un período activo'
                ], 422);
            }

            // Eliminar el período
            $period->delete();

            DB::commit();

            return response()->json([
                'message' => 'Período eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error eliminando período: ' . $e->getMessage());

            return response()->json([
                'message' => 'Error al eliminar el período',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
