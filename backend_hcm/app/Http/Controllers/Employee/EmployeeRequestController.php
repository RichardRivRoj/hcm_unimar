<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Request;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class EmployeeRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtener empleado autenticado usando Sanctum (ajustar según tu sistema de autenticación)
        $user = Auth::user();
        $employee = $user->person->employee;

        if (!$employee instanceof \App\Models\Employee) {
            return response()->json([
                'error' => 'Usuario no vinculado a un empleado',
                'message' => 'Acceso no autorizado'
            ], 403);
        }

        $requests = $employee->requests()
            ->with(['requestType', 'requestStatus'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'data' => $requests->map(function ($request) {
                $description = json_decode($request->description, true);
                $content = $description['content'] ?? 'Descripción no disponible';
                return [
                    'id' => $request->id,
                    'tipo' => $request->requestType->name,
                    'descripcion' => Str::words($content, 10, '...'),
                    'estatus' => $request->requestStatus->name,
                    'fecha_solicitud' => $request->created_at->format('d/m/Y H:i'),
                ];
            }),
            'meta' => [
                'current_page' => $requests->currentPage(),
                'total' => $requests->total(),
                'per_page' => $requests->perPage(),
                'last_page' => $requests->lastPage()
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
    public function store(HttpRequest $request)
    {

        // Limpiar datos entrantes (solo campos necesarios)
        $request->merge([
            'request_type_id' => $request->request_type_id,
            'description' => $request->description
        ]);

        $validated = $request->validate([
            'request_type_id' => 'required|exists:request_types,id',
            'description' => 'required|json'
        ]);

        try {
            $user = Auth::user();
            $employee = $user->person->employee;

            if (!$employee instanceof \App\Models\Employee) {
                return response()->json([
                    'error' => 'Usuario no vinculado a un empleado',
                    'message' => 'Acceso no autorizado'
                ], 403);
            }

            $pendingRequests = $employee->requests
                ->where('request_status_id', 1)
                ->count();

            if ($pendingRequests >= 3) {
                return response()->json([
                    'error' => 'Límite de solicitudes pendientes alcanzado'
                ], 400);
            }

            return DB::transaction(function () use ($employee, $validated) {
                $newRequest = $employee->requests()->create([
                    'request_type_id' => $validated['request_type_id'],
                    'request_status_id' => 1,
                    'description' => $validated['description']
                ]);

                return response()->json([
                    'message' => 'Solicitud creada exitosamente',
                    'data' => [
                        'id' => $newRequest->id,
                        'estatus' => 'Pendiente',
                        'fecha_creacion' => $newRequest->created_at->format('d/m/Y H:i')
                    ]
                ], 201);
            });
        } catch (QueryException $e) {

            Log::error('Error en BD: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error de base de datos',
                'message' => 'No se pudo completar la operación'
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error inesperado',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $request = Request::with(['requestType', 'requestStatus'])
                ->findOrFail($id);
    
            $employee = Auth::user()->person->employee;
    
            // Validar pertenencia de la solicitud
            if ($request->employee_id != $employee->id) {
                return response()->json([
                    'error' => 'No autorizado',
                    'message' => 'Esta solicitud no te pertenece'
                ], 403);
            }
    
            // Parsear el JSON de descripción
            $description = json_decode($request->description, true);
    
            return response()->json([
                'data' => [
                    'id' => $request->id,
                    'tipo' => $request->requestType->name,
                    'descripcion' => $description['content'] ?? $request->description,
                    'estatus' => $request->requestStatus->name,
                    'fecha_solicitud' => $request->created_at->format('d/m/Y H:i'),
                    'detalles' => [
                        'solicitado_el' => $request->created_at->format('d/m/Y H:i'),
                        'ultima_actualizacion' => $request->updated_at->format('d/m/Y H:i'),
                    ]
                ]
            ]);
    
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener la solicitud',
                'message' => $e->getMessage()
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
    public function update(HttpRequest $request, string $id)
    {
        try {
            $employeeRequest = Request::findOrFail($id);
            $employee = Auth::user()->person->employee;

            // Validar pertenencia y estado
            if ($employeeRequest->employee_id != $employee->id) {
                return response()->json([
                    'error' => 'No autorizado',
                    'message' => 'Esta solicitud no te pertenece'
                ], 403);
            }

            if ($employeeRequest->request_status_id != 1) {
                return response()->json([
                    'error' => 'Solicitud no editable',
                    'message' => 'Solo se pueden editar solicitudes en estado Pendiente'
                ], 422);
            }

            // Validar que la descripción es JSON válido
            $validated = $request->validate([
                'description' => [
                    'required',
                    'json',
                    function ($attribute, $value, $fail) {
                        json_decode($value);
                        if (json_last_error() !== JSON_ERROR_NONE) {
                            $fail('El formato JSON no es válido');
                        }
                    },
                    'max:500'
                ]
            ]);


            $employeeRequest->update([
                'description' => $validated['description']
            ]);

            return response()->json([
                'message' => 'Solicitud actualizada exitosamente',
                'data' => $employeeRequest->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al actualizar',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $request = Request::findOrFail($id);
            $employee = Auth::user()->person->employee;

            // Verificar pertenencia de la solicitud
            if ($request->employee_id != $employee->id) {
                return response()->json([
                    'error' => 'No autorizado',
                    'message' => 'Esta solicitud no te pertenece'
                ], 403);
            }

            // Estados que no permiten cancelación
            $nonCancelableStatuses = [2, 3, 4, 5, 6]; // Aprobado, En proceso, Completado

            if (in_array($request->request_status_id, $nonCancelableStatuses)) {
                return response()->json([
                    'error' => 'Acción no permitida',
                    'message' => 'No puedes cancelar solicitudes en estado: ' . $request->requestStatus->name
                ], 422);
            }

            // Verificar si ya está cancelada
            if ($request->request_status_id == 7) {
                return response()->json([
                    'error' => 'Solicitud ya cancelada',
                    'message' => 'Esta solicitud ya fue cancelada anteriormente'
                ], 422);
            }

            // Actualizar estado
            $request->update(['request_status_id' => 7]);

            return response()->json([
                'message' => 'Solicitud cancelada exitosamente',
                'data' => $request->fresh(['requestStatus'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error en el servidor',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
