<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompletionStatus;
use App\Models\Department;
use App\Models\Employee;
use App\Models\EmployeeTrainingEnrollment;
use App\Models\Notification;
use App\Models\ProgramVisibility;
use App\Models\Status;
use App\Models\TrainingModality;
use App\Models\TrainingProgram;
use App\Models\TrainingType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class NewTrainingProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Obtener parámetros de filtrado
            $filters = $request->only([
                'training_type_id',
                'modality_id',
                'visibility_id',
                'status_id',
                'name'
            ]);

            // Consulta base con relaciones y ordenamiento
            $programs = TrainingProgram::with([
                'trainingType:id,name',
                'modality:id,name',
                'visibility:id,name',
                'status:id,name'
            ])
                ->latest()
                ->filter($filters)
                ->paginate(10);

            // Obtener opciones de filtros
            $filterOptions = [
                'training_types' => TrainingType::pluck('name', 'id'),
                'modalities' => TrainingModality::pluck('name', 'id'),
                'visibilities' => ProgramVisibility::pluck('name', 'id'),
                'statuses' => Status::pluck('name', 'id')
            ];

            return response()->json([
                'success' => true,
                'programs' => $programs,
                'filters' => $filterOptions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener programas: ' . $e->getMessage()
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

        // Validación de datos
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'start_date' => 'required|date|after_or_equal:today',
            'content' => 'required|json',
            'end_date' => 'required|date|after_or_equal:start_date',
            'visibility_id' => 'required|exists:program_visibilities,id',
            'training_type_id' => 'required|exists:training_types,id',
            'modality_id' => 'required|exists:training_modalities,id',
            'status_id' => 'required|exists:statuses,id',
            'departments' => 'nullable|array',
            'departments.*' => 'sometimes|exists:departments,id',
            'employees' => 'nullable|array',
            'employees.*' => 'sometimes|exists:employees,id',
            'limit' => 'nullable|integer|min:1',
        ]);

        $validator->sometimes('departments', 'required|min:1', function ($input) {
            return $input->visibility_id == 3;
        });

        $validator->sometimes('employees', 'required|min:1', function ($input) {
            return $input->visibility_id == 2;
        });

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'message' => 'Error de validación'
            ], 422);
        }

        try {

            DB::beginTransaction();

            $validated = $validator->validated();
            $program = TrainingProgram::create($validated);

            // Manejar relaciones según visibilidad
            $this->handleVisibilityRelations($program, $validated);

            DB::commit();

            return response()->json([
                'success' => true,
                'program' => $program->load(['departments', 'enrollment']),
                'message' => 'Programa creado exitosamente'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->validator->errors(),
                'message' => 'Error de validación'
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error del servidor: ' . $e->getMessage()
            ], 500);
        }
    }

    private function handleVisibilityRelations($program, $data)
    {
        switch ($program->visibility_id) {
            case 1: // Público
                $this->sendPublicNotifications($program);
                break;

            case 3: // Departamento
                $this->handleDepartmentalProgram($program, $data['departments']);
                $this->sendDepartmentalNotifications($program, $data['departments']);
                break;

            case 2: // Privado
                $this->handlePrivateProgram($program, $data['employees']);
                $this->sendPrivateNotifications($program, $data['employees']);
                break;
        }
    }

    private function handleDepartmentalProgram($program, $departments)
    {
        // 1. Vincular departamentos (ahora usando belongsToMany)
        $program->departments()->sync($departments);

        // 2. Obtener empleados activos en departamentos
        $employeeIds = Employee::active()
            ->whereHas('contracts', function ($query) use ($departments) {
                $query->whereIn('department_id', $departments);
            })
            ->pluck('id');

        // 3. Crear inscripciones masivas
        $this->createEnrollments($program->id, collect($employeeIds));
    }

    private function handlePrivateProgram($program, $employeeIds)
    {
        $this->createEnrollments($program->id, collect($employeeIds));
    }

    private function createEnrollments($programId, $employeeIds)
    {
        $pendingStatusId = CompletionStatus::firstWhere('name', 'Inscrito')->id;
        $now = now()->toDateTimeString();

        $enrollments = collect($employeeIds)->map(function ($employeeId) use ($programId, $pendingStatusId, $now) {
            return [
                'employee_id' => $employeeId,
                'training_program_id' => $programId,
                'enrollment_date' => $now,
                'assigned_by_admin' => true,
                'completion_status_id' => $pendingStatusId,
                'created_at' => $now,
                'updated_at' => $now
            ];
        });

        EmployeeTrainingEnrollment::insert($enrollments->toArray());
    }

    private function sendPublicNotifications($program)
    {
        // Obtener todos los empleados activos con sus usuarios
        $userIds = Employee::active()
            ->with('person.user')
            ->get()
            ->pluck('person.user.id')
            ->filter();

        foreach ($userIds as $userId) {
            Notification::create([
                'user_id' => $userId,
                'title' => 'Nuevo programa de capacitación disponible',
                'message' => 'Se ha publicado un nuevo programa: ' . $program->name,
                'type' => 'info',
                'metadata' => [
                    'program_id' => $program->id,
                    'action_url' => "/training/{$program->id}"
                ]
            ]);
        }
    }

    private function sendPrivateNotifications($program, $employeeIds)
    {
        // Obtener usuarios de los empleados seleccionados
        $userIds = Employee::whereIn('id', $employeeIds)
            ->with('person.user')
            ->get()
            ->pluck('person.user.id')
            ->filter();

        foreach ($userIds as $userId) {
            Notification::create([
                'user_id' => $userId,
                'title' => 'Has sido inscrito en un programa',
                'message' => 'Te has asignado al programa: ' . $program->name,
                'type' => 'info',
                'metadata' => [
                    'program_id' => $program->id,
                    'action_url' => "/training/{$program->id}"
                ]
            ]);
        }
    }

    private function sendDepartmentalNotifications($program, $departmentIds)
    {
        // Obtener supervisores usando Spatie Roles
        $supervisorRole = Role::findByName('supervisor', 'web');
        // 2. Obtener usuarios con el rol usando with('roles')
        $supervisors = $supervisorRole->users()
            ->whereHas('roles', function ($q) {
                $q->where('name', 'supervisor')
                    ->where('guard_name', 'web');
            })
            ->pluck('id');

        // Notificar supervisores
        foreach ($supervisors as $userId) {
            Notification::create([
                'user_id' => $userId,
                'title' => 'Capacitación asignada a tu departamento',
                'message' => 'Tu departamento tiene un nuevo programa: ' . $program->name,
                'type' => 'info',
                'metadata' => [
                    'program_id' => $program->id,
                    'action_url' => "/training/{$program->id}"
                ]
            ]);
        }

        // Notificar empleados inscritos
        $employeeUsers = EmployeeTrainingEnrollment::where('training_program_id', $program->id)
            ->with('employee.person.user')
            ->get()
            ->pluck('employee.person.user.id')
            ->filter();

        foreach ($employeeUsers as $userId) {
            Notification::create([
                'user_id' => $userId,
                'title' => 'Inscripción en programa de capacitación',
                'message' => 'Has sido inscrito en el programa: ' . $program->name,
                'type' => 'info',
                'metadata' => [
                    'program_id' => $program->id,
                    'action_url' => "/training/{$program->id}"
                ]
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $program = TrainingProgram::with([
                'trainingType:id,name,description',
                'modality:id,name,description',
                'visibility:id,name,description',
                'status:id,name',
            ])->findOrFail($id);
    
            return response()->json([
                'success' => true,
                'program' => $program
            ]);
    
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Programa no encontrado: ' . $e->getMessage()
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
