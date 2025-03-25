<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Request;
use App\Models\RequestStatus;
use App\Models\RequestType;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AdminRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(HttpRequest $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string',
            'request_type' => 'nullable|exists:request_types,id',
            'status' => 'nullable|exists:request_statuses,id'
        ]);

        $baseQuery = Request::with([
            'employee.person.identificationType',
            'requestType',
            'requestStatus',
            'employee.contracts.department' // Cargar todos los contratos y departamentos
        ]);



        // Aplicar filtros
        if ($request->filled('search')) {
            $search = "%{$request->search}%";
            $baseQuery->whereHas('employee.person', function ($query) use ($search) {
                $query->where('first_name', 'like', $search)
                    ->orWhere('last_name', 'like', $search)
                    ->orWhere('identification_value', 'like', $search);
            });
        }

        if ($request->filled('request_type')) {
            $baseQuery->where('request_type_id', $request->request_type);
        }

        if ($request->filled('status')) {
            $baseQuery->where('request_status_id', $request->status);
        }

        // Ordenamiento y paginación
        $requests = $baseQuery->orderBy('created_at', 'desc')->paginate(10);


        // Transformar datos

        // Formatear los datos para que muestren el departamento correcto
        $formattedRequests = $requests->map(function ($request) {

            // Buscar el contrato más cercano (aunque no sea válido en la fecha exacta)
            $contract = $request->employee->contracts
                ->sortBy('start_date') // Ordenar por fecha de inicio ascendente
                ->firstWhere(function ($contract) use ($request) {
                    return is_null($contract->end_date) || $contract->end_date >= $request->created_at;
                });
            return [
                'request_id' => $request->id ?? 'Sin identificador',
                'full_name' => $request->employee->person->first_name . ' ' . $request->employee->person->last_name,
                'identification_type' => $request->employee->person->identificationType->code,
                'identification_number' => $request->employee->person->identification_value,
                'department' => $contract ? $contract->department->name : 'No asignado',
                'request_type' => $request->requestType->name,
                'request_status' => $request->requestStatus->name,
                'created_at' => $request->created_at
            ];
        });

        return response()->json([
            'data' => $formattedRequests,
            'meta' => [
                'current_page' => $requests->currentPage(),
                'total' => $requests->total(),
                'per_page' => $requests->perPage(),
                'last_page' => $requests->lastPage(),
                'filters' => [
                    'request_types' => RequestType::all(['id', 'name']),
                    'statuses' => RequestStatus::all(['id', 'name'])
                ]
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $request = Request::with([
                'employee.person' => function ($query) {
                    $query->with([
                        'identificationType',
                        'status',
                        'countries',
                        'ethnicity',
                        'marital_status',
                        'gender',
                        'user' // Para email institucional
                    ]);
                },
                'employee.contracts' => function ($query) {
                    $query->with([
                        'department',
                        'contractType',
                        'status',
                        'position.level.salaries' => function ($q) {
                            $q->with('currency')
                                ->orderBy('valid_from', 'desc')
                                ->limit(1);
                        }
                    ])->latest();
                },
                'requestType',
                'requestStatus'
            ])->findOrFail($id);

            // Estructura de respuesta mejorada
            $response = [
                'personal_info' => [
                    'nombre_completo' => $request->employee->person->first_name . ' ' . $request->employee->person->last_name,
                    'identificacion' => [
                        'tipo' => $request->employee->person->identificationType->code,
                        'numero' => $request->employee->person->identification_value
                    ],
                    'correos' => [
                        'personal' => $request->employee->person->email,
                        'institucional' => $request->employee->person->user->email ?? 'N/A'
                    ],
                    'estado_persona' => $request->employee->person->status->name
                ],
                'solicitud' => [
                    'tipo' => $request->requestType->name,
                    'estado' => $request->requestStatus->name,
                    'descripcion' => $request->description
                ],
                'contratos' => $request->employee->contracts->map(function ($contract) {
                    return [
                        'numero_contrato' => $contract->contract_number,
                        'tipo_contrato' => $contract->contractType->name,
                        'departamento' => $contract->department->name,
                        'fecha_inicio' => $contract->start_date,
                        'fecha_fin' => $contract->end_date ?? 'INDEFINIDO', 
                        'posicion' => [
                            'nombre' => $contract->position->description,
                            'nivel' => $contract->position->level->name,
                            'salario' => $contract->position->level->salaries->isNotEmpty() ? [
                                'monto' => $contract->position->level->salaries->first()->amount,
                                'moneda' => $contract->position->level->salaries->first()->currency->short_name,
                                'vigente_desde' => $contract->position->level->salaries->first()->valid_from
                            ] : null
                        ]
                    ];
                })
            ];

            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Recurso no encontrado',
                'message' => $e->getMessage()
            ], 404);
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
        DB::beginTransaction();

        try {
            // 1. Validación inicial fuera de la transacción
            $validated = $request->validate([
                'status' => 'required|in:Aprobado,Rechazado'
            ]);

            // 2. Obtener recursos necesarios
            $requestModel = Request::with(['employee.person.user', 'requestType'])
                ->findOrFail($id);

            $newStatus = RequestStatus::where('name', $validated['status'])
                ->firstOrFail();

            // 3. Verificar relaciones críticas
            if (!$requestModel->employee?->person?->user) {
                throw new \Exception('La estructura de relaciones del empleado es inválida');
            }

            // 4. Actualización atómica
            $requestModel->update(['request_status_id' => $newStatus->id]);

            // 5. Creación de notificación
            $notificationData = [
                'user_id' => $requestModel->employee->person->user->id,
                'title' => "Solicitud {$validated['status']}",
                'message' => "Tu solicitud de {$requestModel->requestType->name} ha sido {$validated['status']}",
                'type' => $validated['status'] === 'Aprobado' ? 'success' : 'danger',
                'metadata' => json_encode([
                    'request_id' => $requestModel->id,
                    'new_status' => $newStatus->name
                ])
            ];

            Notification::create($notificationData);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $requestModel->fresh(['requestStatus']),
                'notification' => $notificationData
            ]);
        } catch (ValidationException $e) {
            // Error de validación (400)
            return response()->json([
                'error' => 'Datos inválidos',
                'messages' => $e->errors()
            ], 400);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Recurso no encontrado',
                'message' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error en la transacción',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Métodos auxiliares
    private function getNotificationType($status)
    {
        return match ($status) {
            'Aprobado' => 'success',
            'Rechazado' => 'danger',
            default => 'info'
        };
    }

    private function generateNotificationMessage($request, $status)
    {
        $baseMessage = "Tu solicitud de {$request->requestType->name} ";

        return $baseMessage . match ($status) {
            'Aprobado' => "ha sido aprobada. " . $request->approval_notes ?? '',
            'Rechazado' => "ha sido rechazada. Motivo: " . $request->rejection_notes ?? '',
            default => "ha cambiado de estado a {$status}"
        };
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
