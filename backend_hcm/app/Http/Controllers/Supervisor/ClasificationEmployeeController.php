<?php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;

class ClasificationEmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Obtener el usuario autenticado
        $supervisor = Auth::user();

        // Verificar que el usuario sea supervisor
        if (!$supervisor->hasRole('supervisor')) {
            return response()->json([
                'error' => 'No autorizado',
                'message' => 'Solo los supervisores pueden acceder a esta información'
            ], 403);
        }

        // Obtener el departamento del supervisor
        $department = $supervisor->department;

        if (!$department) {
            return response()->json([
                'error' => 'Departamento no encontrado',
                'message' => 'El supervisor no tiene un departamento asignado'
            ], 404);
        }

        // Obtener parámetros de búsqueda
        $search = $request->input('search');
        $position = $request->input('position');

        $query = Employee::with([
            'person.identificationtype',
            'contracts' => function($q) {
                $q->with(['position', 'department']);
            },
            'person.user'
        ])
        ->whereHas('contracts', function ($query) use ($department) {
            // Filtrar por departamento a través del contrato
            $query->where('department_id', $department->id)
                  ->where('status_id', 1);
        });
        
        // Aplicar filtros corregidos
        if ($search) {
            $query->whereHas('person', function ($q) use ($search) {
                $q->where('first_name', 'like', "%$search%")
                    ->orWhere('last_name', 'like', "%$search%");
            });
        }
        
        if ($position) {
            $query->whereHas('contracts.position', function ($q) use ($position) {
                $q->where('description', 'like', "%$position%");
            });
        }
        
        // Transformación de datos corregida
        $employees = $query->paginate(4)->through(function ($employee) {
            return [
                'employe_id' => $employee->id,
                'full_name' => $employee->person->first_name . ' ' . $employee->person->last_name, // Cambiar persons por person
                'identification_type' => $employee->person->identificationtype->code,
                'identification_value' => $employee->person->identification_value,
                'position' => $employee->contracts->position->description,
                'department' => $employee->contracts->department->name,
                'email' => $employee->person->user->email,
                'status' => $employee->contracts->status,
                'contract_start' => $employee->contracts->start_date, // Corregir star_date por start_date
                'contract_end' => $employee->contracts->end_date ?? 'Indefinido'
            ];
        });

        return response()->json([
            'department' => $department->name,
            'total_employees' => $employees->total(),
            'current_page' => $employees->currentPage(),
            'last_page' => $employees->lastPage(),
            'per_page' => $employees->perPage(),
            'employees' => $employees->items()
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
    public function show(string $id)
    {
        // Obtener el empleado por ID
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['error' => 'Empleado no encontrado'], 404);
        }

        // Obtener la información de la persona relacionada con el empleado
        $person = $employee->person;

        $user = $person->user;

        // Obtener los documentos de la persona
        $documents = $person ? $person->documents : collect();

        // Filtrar y obtener los dos documentos más recientes de cada tipo
        $recentJobs = $documents->where('document_type_id', '1')
            ->sortByDesc('issue_date')
            ->take(2)
            ->map(function ($doc) {
                $metadata = json_decode($doc->metadata, true);
                return [
                    'document_name' => $doc->document_name,
                    'company_name' => $metadata['company_name'] ?? 'No especificado',
                    'position' => $metadata['position'] ?? 'No especificado',
                    'responsibilities' => $metadata['responsibilities'] ?? 'No especificado',
                    'issue_date' => $doc->issue_date,
                    'expiration_date' => $doc->expiration_date,
                ];
            });

        $recentStudies = $documents->where('document_type_id', '2')
            ->sortByDesc('issue_date')
            ->take(2)
            ->map(function ($doc) {
                $metadata = json_decode($doc->metadata, true);
                return [
                    'document_name' => $doc->document_name,
                    'institution' => $metadata['institution'] ?? 'No especificado',
                    'degree' => $metadata['degree'] ?? 'No especificado',
                    'issue_date' => $doc->issue_date,
                    'expiration_date' => $doc->expiration_date,
                ];
            });

        $recentCourses = $documents->where('document_type_id', '3')
            ->sortByDesc('issue_date')
            ->take(2)
            ->map(function ($doc) {
                $metadata = json_decode($doc->metadata, true);
                return [
                    'document_name' => $doc->document_name,
                    'institution' => $metadata['institution'] ?? 'No especificado',
                    'hours' => $metadata['hours'] ?? 'No especificado',
                    'instructor' => $metadata['instructor'] ?? 'No especificado',
                    'issue_date' => $doc->issue_date,
                    'expiration_date' => $doc->expiration_date,
                ];
            });

        // Competencias e idiomas
        $competencies = $documents->where('document_type_id', 10)
            ->map(function ($doc) {
                $detail = json_decode($doc->detail, true);
                return [
                    'document_name' => $doc->document_name,
                    'skills' => $detail ?? ['No especificado']
                ];
            });

        $languages = $documents->where('document_type_id', 9)
            ->map(function ($doc) {
                $detail = json_decode($doc->detail, true);
                return [
                    'document_name' => $doc->document_name,
                    'level' => $detail['level'] ?? 'No especificado'
                ];
            });

        // Obtener la información del departamento del empleado
        $department = $employee->contract->department;

        return response()->json([
            'employee_id' => $employee->id,
            'department_id' => $employee->contract->department_id,
            'person_id' => $employee->person_id,
            'person' => $person ? [
                'first_name' => $person->first_name,
                'last_name' => $person->last_name,
                'email' => $person->email,
                'birth_date' => $person->birth_date,
                'phone' => $person->phone,
                'identification_value' => $person->identification_value,
                'identification_type' => $person->identificationtype ? $person->identificationtype->code : null,
                'gender' => $person->gender ? $person->gender->name : null,
                'ethnicity' => $person->ethnicity ? $person->ethnicity->name : null,
                'marital_status' => $person->maritalstatus ? $person->maritalstatus->name : null,
                'country' => $person->country ? $person->country->name : null,
                'status' => $person->status ? $person->status->name : null,
                'summary' => $person->summary,
                'photo_url' => $person->file_path
                    ? URL::to('/photos/' . basename($person->file_path))
                    : null,
                'competencies' => $competencies->isEmpty() ? 'No hay competencias registradas' : $competencies,
                'languages' => $languages->isEmpty() ? 'No hay idiomas registrados' : $languages,
                'recent_jobs' => $recentJobs->isEmpty() ? 'No hay información de empleos' : $recentJobs,
                'recent_studies' => $recentStudies->isEmpty() ? 'No hay información de estudios' : $recentStudies,
                'recent_courses' => $recentCourses->isEmpty() ? 'No hay información de cursos' : $recentCourses,
            ] : null,
            'user' => $user ? [
                'email_user' => $user->email ?? 'No hay información',
            ] : null,
            'department' => $department ? [
                'name' => $department->name,
                'description' => $department->description,
                'code' => $department->code,
                'mission' => $department->mission,
                'vision' => $department->vision,
                'responsibilities' => json_decode($department->responsibilities, true),
                'objectives' => json_decode($department->objectives, true),
                'contact_info' => $department->contact_info,
                'file_path' => $department->file_path,
                'extra_data' => json_decode($department->extra_data, true),
                'status' => $department->status ? $department->status->name : null,
            ] : null,
        ]);
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
