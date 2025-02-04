<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Status;
use App\Models\Vacancy;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class PublicVacancyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Validación de parámetros
            $validated = $request->validate([
                'per_page' => 'sometimes|integer|min:1|max:10' // Límite máximo de 10 por página
            ]);
    
            // Configuración de paginación
            $perPage = $validated['per_page'] ?? 3;
            
            // Obtener el estado "Activo"
            $activeStatus = Status::where('name', 'Activo')->firstOrFail();
    
            // Consulta optimizada con eager loading
            $vacancies = Vacancy::with(['position', 'department', 'mode', 'status'])
                ->where('status_id', $activeStatus->id)
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);
    
            // Estructura de respuesta estandarizada
            return response()->json([
                'status' => 'success',
                'message' => 'Vacantes activas obtenidas exitosamente',
                'data' => [
                    'vacancies' => $vacancies->items(),
                    'pagination' => [
                        'total' => $vacancies->total(),
                        'per_page' => $vacancies->perPage(),
                        'current_page' => $vacancies->currentPage(),
                        'last_page' => $vacancies->lastPage(),
                        'from' => $vacancies->firstItem(),
                        'to' => $vacancies->lastItem()
                    ]
                ]
            ]);
    
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'No se encontró el estado activo'
            ], 404);
            
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener las vacantes: ' . $e->getMessage()
            ], 500);
        } 
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            // Obtener el estado "Activo"
            $activeStatus = Status::where('name', 'Activo')->firstOrFail();
    
            // Buscar vacante con relaciones y validar que esté activa
            $vacancy = Vacancy::with([
                'position',
                'department',
                'mode',
                'status'
            ])
            ->where('status_id', $activeStatus->id)
            ->findOrFail($id);
    
            // Estructura de respuesta detallada
            return response()->json([
                'status' => 'success',
                'message' => 'Vacante activa obtenida exitosamente',
                'data' => [
                    'vacancy' => [
                        'id' => $vacancy->id,
                        'title' => $vacancy->title,
                        'description' => $vacancy->description,
                        'requirements' => $vacancy->requirements,
                        'num_vacancy' => $vacancy->num_vacancy,
                        'created_at' => $vacancy->created_at->toDateString(),
                        'position' => $vacancy->position,
                        'department' => $vacancy->department,
                        'mode' => $vacancy->mode,
                        'status' => $vacancy->status,
                        // Agregar más campos si son necesarios
                    ]
                ]
            ], 200);
    
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vacante no encontrada o no está activa'
            ], 404);
    
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener la vacante: ' . $e->getMessage()
            ], 500);
        }
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
