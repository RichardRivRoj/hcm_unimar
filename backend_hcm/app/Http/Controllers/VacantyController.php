<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Status;
use App\Models\Vacancy;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class VacantyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Consulta base con relaciones
        $query = Vacancy::with([
            'position',       // Relación con Position
            'department',     // Relación con Department
            'mode',           // Relación con Modality
            'status',         // Relación con Status
        ])
            ->latest(); // Ordenar por fecha de creación (más recientes primero)

        // Aplicar filtros
        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('position_id')) {
            $query->where('position_id', $request->position_id);
        }

        if ($request->filled('status_id')) {
            $query->where('status_id', $request->status_id);
        }

        $vacancies = $query->paginate(20);
        // Estructura de respuesta
        return response()->json([
            'success' => true,
            'data' => $vacancies->items(), // Datos de las vacantes
            'meta' => [
                'current_page' => $vacancies->currentPage(),
                'last_page' => $vacancies->lastPage(),
                'per_page' => $vacancies->perPage(),
                'total' => $vacancies->total(),
            ],
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        try {
            $validated = $request->validate([
                'position_id' => 'required|exists:positions,id',
                'department_id' => 'required|exists:departments,id',
                'title' => 'required|max:100',
                'description' => 'required|string',
                'requirements' => 'required|json',
                'num_vacancy' => 'required|integer',
                'mode_id' => 'required|exists:modalities,id',
                'status_id' => 'sometimes|exists:statuses,id'
            ]);

            $vacancies = Vacancy::create([
                'position_id' => $validated['position_id'],
                'department_id' => $validated['department_id'],
                'title' => $validated['title'],
                'description' => $validated['description'],
                'requirements' => $validated['requirements'],
                'num_vacanty' => $validated['num_vacanty'] ?? 1,
                'mode_id' => $validated['mode_id'],
                'status_id' => $validated['status_id'] ?? 1 // Valor por defecto
            ]);

            return response()->json([
                'message' => 'Oferta laboral creada correctamente',
                'vacancy' => $vacancies
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear la vacante: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $jobPosition = Vacancy::with([
            'position',       // Relación con Position
            'department',     // Relación con Department
            'mode',           // Relación con Modality
            'status',         // Relación con Status
        ])->findOrFail($id);

        return response()->json($jobPosition);
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
        // Validación de datos
        $validated = $request->validate([
            'position_id' => 'required|exists:positions,id',
            'department_id' => 'required|exists:departments,id',
            'title' => 'required|string|max:100',
            'description' => 'required|string',
            'requirements' => 'required|json',
            'num_vacancy' => 'required|integer|min:1',
            'mode_id' => 'required|exists:modalities,id',
            'status_id' => 'required|exists:statuses,id'
        ]);

        try {
            // Buscar la vacante
            $vacancy = Vacancy::findOrFail($id);

            // Actualizar los datos
            $vacancy->update([
                'position_id' => $validated['position_id'],
                'department_id' => $validated['department_id'],
                'title' => $validated['title'],
                'description' => $validated['description'],
                'requirements' => $validated['requirements'],
                'num_vacancy' => $validated['num_vacancy'],
                'mode_id' => $validated['mode_id'],
                'status_id' => $validated['status_id']
            ]);

            // Cargar relaciones actualizadas
            $vacancy->load(['position', 'department', 'mode', 'status']);

            return response()->json([
                'success' => true,
                'message' => 'Vacante actualizada exitosamente',
                'data' => $vacancy
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Vacante no encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la vacante',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            // Buscar la vacante
            $vacancy = Vacancy::findOrFail($id);
    
            // Cambiar el estado a "inactivo"
            $vacancy->update([
                'status_id' => Status::where('name', 'Inactivo')->first()->id,
            ]);
    
            return response()->json([
                'success' => true,
                'message' => 'Vacante desactivada exitosamente',
            ], 200);
    
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al desactivar la vacante',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
