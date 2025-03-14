<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\CompletionStatus;
use App\Models\EmployeeTrainingEnrollment;
use App\Models\Notification;
use App\Models\ProgramVisibility;
use App\Models\Status;
use App\Models\TrainingProgram;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EmployeeTrainingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $employee = $user->person->employee;

        // Obtener IDs necesarios
        $publicVisibility = ProgramVisibility::firstWhere('name', 'PUBLICO');
        $activeStatus = Status::firstWhere('name', 'Activo');
        $completedStatus = CompletionStatus::firstWhere('name', 'COMPLETADO');
        $canceledStatus = CompletionStatus::firstWhere('name', 'Cancelado');

        if (!$publicVisibility || !$activeStatus || !$completedStatus || !$canceledStatus) {
            return response()->json(['error' => 'Configuración requerida no encontrada'], 500);
        }

        $perPage = $request->input('per_page', 2);

        // 1. Programas Públicos
        $publicPrograms = TrainingProgram::with(['trainingType'])
            ->where('visibility_id', $publicVisibility->id)
            ->where('status_id', $activeStatus->id)
            ->where('start_date', '>', now())
            ->whereDoesntHave('enrollment', function ($query) use ($employee) {
                $query->where('employee_id', $employee->id)
                    ->whereIn('completion_status_id', [
                        CompletionStatus::where('name', 'Inscrito')->first()->id,
                        CompletionStatus::where('name', 'En Proceso')->first()->id
                    ]);
            })
            ->filterByRequest($request)
            ->withCount('enrollment as enrolled_count')
            ->select('id', 'name', 'description', 'limit', 'start_date', 'end_date', 'training_type_id')
            ->paginate(
                $perPage,
                ['*'],
                'public_page',
                $request->input('public_page')
            );

        $publicPrograms->getCollection()->transform(function ($program) {
            return [
                'id' => $program->id,
                'completion_classification' => 'PUBLICO',
                'name' => $program->name,
                'description' => $program->description,
                'available_slots' => $program->limit - $program->enrolled_count,
                'start_date' => $program->start_date->format('Y-m-d'),
                'end_date' => $program->end_date->format('Y-m-d'),
                'training_type' => $program->trainingType->name,
            ];
        });

        // 2. Programas Inscritos/En Progreso
        $enrolledPrograms = TrainingProgram::with(['trainingType'])
            ->where('status_id', $activeStatus->id)
            ->whereHas('enrollment', function ($query) use ($employee) {
                $query->where('employee_id', $employee->id)
                    ->whereIn('completion_status_id', [
                        CompletionStatus::where('name', 'Inscrito')->first()->id,
                        CompletionStatus::where('name', 'En Proceso')->first()->id
                    ]);
            })
            ->where(function ($query) {
                $query->where('start_date', '>', now())
                    ->orWhere(function ($q) {
                        $q->where('start_date', '<=', now())
                            ->where('end_date', '>', now());
                    });
            })
            ->filterByRequest($request)
            ->withCount('enrollment as enrolled_count')
            ->select('id', 'name', 'description', 'start_date', 'end_date', 'training_type_id')
            ->paginate(
                $perPage,
                ['*'],
                'enrolled_page',
                $request->input('enrolled_page')
            );

        $enrolledPrograms->getCollection()->transform(function ($program) {
            $status = $program->start_date > now() ? 'INSCRITOS' : 'EN_PROGRESO';
            return [
                'id' => $program->id,
                'completion_classification' => $status,
                'name' => $program->name,
                'description' => $program->description,
                'enrolled_count' => $program->enrolled_count,
                'start_date' => $program->start_date->format('Y-m-d'),
                'end_date' => $program->end_date->format('Y-m-d'),
                'training_type' => $program->trainingType->name,
            ];
        });

        // 3. Programas Completados
        $completedPrograms = TrainingProgram::with(['trainingType'])
            ->where('status_id', $activeStatus->id)
            ->whereHas('enrollment', function ($query) use ($employee, $completedStatus) {
                $query->where('employee_id', $employee->id)
                    ->where(function ($q) use ($completedStatus) {
                        $q->where('completion_status_id', $completedStatus->id)
                            ->orWhereHas('training', function ($subQ) {
                                $subQ->where('end_date', '<=', now());
                            });
                    });
            })
            ->filterByRequest($request)
            ->withCount('enrollment as enrolled_count')
            ->select('id', 'name', 'description', 'start_date', 'end_date', 'training_type_id')
            ->paginate(
                $perPage,
                ['*'],
                'completed_page',
                $request->input('completed_page')
            );

        $completedPrograms->getCollection()->transform(function ($program) {
            return [
                'id' => $program->id,
                'completion_classification' => 'COMPLETADO',
                'name' => $program->name,
                'description' => $program->description,
                'enrolled_count' => $program->enrolled_count,
                'start_date' => $program->start_date->format('Y-m-d'),
                'end_date' => $program->end_date->format('Y-m-d'),
                'training_type' => $program->trainingType->name,
            ];
        });

        return response()->json([
            'public_programs' => $publicPrograms->toArray(),
            'enrolled_programs' => $enrolledPrograms->toArray(),
            'completed_programs' => $completedPrograms->toArray(),
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
        $user = Auth::user();
        $employee = $user->person->employee;

        DB::beginTransaction();

        try {
            // Validar datos del request
            $validated = $request->validate([
                'training_program_id' => 'required|exists:training_programs,id'
            ]);

            $program = TrainingProgram::findOrFail($validated['training_program_id']);
            $completionStatus = CompletionStatus::firstWhere('name', 'Inscrito');
            $cancelStatus = CompletionStatus::firstWhere('name', 'Cancelado');

            // Validar que el programa no haya comenzado
            if (Carbon::now()->greaterThanOrEqualTo($program->start_date)) {
                return response()->json([
                    'message' => 'No puedes inscribirte en un programa que ya ha comenzado'
                ], 400);
            }

            // 1. Verificar si ya está inscrito (incluyendo soft deletes)
            $existingEnrollment = EmployeeTrainingEnrollment::withTrashed()
                ->where('employee_id', $employee->id)
                ->where('training_program_id', $program->id)
                ->first();

            if ($existingEnrollment) {
                if ($existingEnrollment->completion_status_id === $cancelStatus->id) {
                    // Actualizar estado de Cancelado a Inscrito
                    $existingEnrollment->update([
                        'completion_status_id' => $completionStatus->id,
                        'enrollment_date' => now(),
                        'deleted_at' => null
                    ]);
                } else if (!$existingEnrollment->trashed()) {
                    return response()->json([
                        'message' => 'Ya estás inscrito en este programa'
                    ], 409);
                }
            } else {
                // 2. Verificar cupos disponibles
                if ($program->limit !== null) {
                    $currentEnrollments = EmployeeTrainingEnrollment::where('training_program_id', $program->id)
                        ->count();

                    if ($currentEnrollments >= $program->limit) {
                        return response()->json([
                            'message' => 'No hay cupos disponibles para este programa'
                        ], 400);
                    }
                }

                // Crear nueva inscripción
                EmployeeTrainingEnrollment::create([
                    'employee_id' => $employee->id,
                    'training_program_id' => $program->id,
                    'completion_status_id' => $completionStatus->id,
                    'enrollment_date' => now()
                ]);
            }

            // 3. Actualizar contador de cupos si aplica
            if ($program->limit !== null) {
                $program->decrement('limit');
            }

            DB::commit();

            // Crear notificación para administradores
            $admins = User::whereHas('roles', function ($query) {
                $query->where('name', 'admin');
            })->get();

            foreach ($admins as $admin) {
                Notification::create([
                    'user_id' => $admin->id,
                    'title' => 'Nueva inscripción en programa de capacitación',
                    'message' => "El empleado {$employee->full_name} se ha inscrito en el programa: {$program->name}",
                    'type' => 'success',
                    'metadata' => [
                        'program_id' => $program->id,
                        'employee_id' => $employee->id,
                        'enrollment_date' => now()->toISOString()
                    ]
                ]);
            }

            return response()->json([
                'message' => 'Inscripción exitosa',
                'program' => $program->only('id', 'name', 'start_date')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al procesar la inscripción',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = Auth::user();
        $employee = $user->person->employee;

        $program = TrainingProgram::with([
            'trainingType',
            'modality',
            'visibility',
            'status',
            'enrollment.employee.person'
        ])->findOrFail($id);

        $response = [
            'id' => $program->id,
            'name' => $program->name,
            'description' => $program->description,
            'content' => $program->content,
            'start_date' => $program->start_date->format('Y-m-d'),
            'end_date' => $program->end_date->format('Y-m-d'),
            'training_type' => $program->trainingType->name,
            'modality' => $program->modality->name,
            'visibility' => $program->visibility->name,
            'status' => $program->status->name,
            'limit' => $program->limit,
        ];

        // Determinar clasificación
        $enrollment = $program->enrollment->where('employee_id', $employee->id)->first();

        if ($enrollment) {
            if ($enrollment->completion->name === 'COMPLETADO' || $program->end_date->isPast()) {
                // COMPLETADO
                $response['classification'] = 'COMPLETADO';
                $response['results'] = [
                    'score' => $enrollment->score,
                    'attendance_rate' => $enrollment->attendance_rate,
                    'completion_date' => $enrollment->updated_at->format('Y-m-d')
                ];

                // Todos los participantes completados
                $response['participants'] = $program->enrollment()
                    ->whereHas('completion', function ($q) {
                        $q->where('name', 'COMPLETADO');
                    })
                    ->with(['employee.person', 'completion'])
                    ->get()
                    ->map(function ($enrollment) {
                        return [
                            'employee' => $enrollment->employee->person->full_name,
                            'score' => $enrollment->score,
                            'attendance' => $enrollment->attendance_rate,
                            'completion_status' => $enrollment->completion->name
                        ];
                    });
            } else if ($enrollment->completion->name === 'Cancelado') {
                // CANCELADO
                $response['classification'] = 'PUBLICO';
                $response['available_slots'] = $program->limit - $program->enrollment->count();
            } else {
                // INSCRITO/EN PROGRESO
                $response['classification'] = $program->start_date->isFuture() ? 'INSCRITOS' : 'EN_PROGRESO';

                // Listado de inscritos
                $response['enrolled_employees'] = $program->enrollment()
                    ->with('employee.person')
                    ->get()
                    ->map(function ($enrollment) {
                        return [
                            'employee_id' => $enrollment->employee_id,
                            'name' => $enrollment->employee->person->first_name. ' ' .$enrollment->employee->person->last_name,
                            'email' => $enrollment->employee->person->user->email,
                            'enrollment_date' => $enrollment->enrollment_date->format('Y-m-d')
                        ];
                    });
            }
        } else {
            // PÚBLICO
            $response['classification'] = 'PUBLICO';
            $response['available_slots'] = $program->limit - $program->enrollment->count();
        }

        return response()->json($response);
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
    public function destroy($id)
    {
        $user = Auth::user();
        $employee = $user->person->employee;

        DB::beginTransaction();

        try {
            $program = TrainingProgram::findOrFail($id);
            $cancelStatus = CompletionStatus::firstOrCreate(
                ['name' => 'Cancelado'],
                ['description' => 'Inscripción cancelada por el empleado']
            );

            // Buscar la inscripción activa
            $enrollment = EmployeeTrainingEnrollment::where('employee_id', $employee->id)
                ->where('training_program_id', $program->id)
                ->where('completion_status_id', '!=', $cancelStatus->id)
                ->first();

            if (!$enrollment) {
                return response()->json([
                    'message' => 'No estás inscrito en este programa o ya fue cancelado'
                ], 404);
            }

            // Validar que el programa no haya finalizado
            if (Carbon::now()->greaterThan($program->end_date)) {
                return response()->json([
                    'message' => 'No puedes cancelar una inscripción de un programa finalizado'
                ], 400);
            }

            // Actualizar estado a Cancelado
            $enrollment->update([
                'completion_status_id' => $cancelStatus->id,
                'deleted_at' => now() // Opcional: solo si quieres combinar con soft delete
            ]);

            // Incrementar cupos disponibles
            if ($program->limit !== null) {
                $program->increment('limit');
            }

            // Notificación a administradores
            $admins = User::whereHas('roles', function ($query) {
                $query->where('name', 'admin');
            })->get();

            foreach ($admins as $admin) {
                Notification::create([
                    'user_id' => $admin->id,
                    'title' => 'Cancelación de inscripción',
                    'message' => "El empleado {$employee->full_name} canceló su inscripción en: {$program->name}",
                    'type' => 'warning',
                    'metadata' => [
                        'program_id' => $program->id,
                        'employee_id' => $employee->id,
                        'cancelation_date' => now()->toISOString()
                    ]
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Inscripción cancelada exitosamente',
                'program' => $program->only('id', 'name')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al cancelar la inscripción',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
