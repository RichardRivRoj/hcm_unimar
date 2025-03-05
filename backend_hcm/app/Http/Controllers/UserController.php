<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        // Obtener la información de la persona relacionada con el usuario
        $person = $user->person;

        // Obtener los documentos de la persona
        $documents = $person ? $person->documents : collect();

        // Filtrar y obtener los dos documentos más recientes de cada tipo
        $recentJobs = $documents->where('document_type_id', '1') // Cambia 'employment' por el valor correcto
            ->sortByDesc('issue_date')
            ->take(2)
            ->map(function ($doc) {
                $metadata = json_decode($doc->metadata, true); // Decodificar el JSON de metadata
                return [
                    'document_name' => $doc->document_name,
                    'company_name' => $metadata['company_name'] ?? 'No especificado',
                    'position' => $metadata['position'] ?? 'No especificado',
                    'responsibilities' => $metadata['responsibilities'] ?? 'No especificado',
                    'issue_date' => $doc->issue_date,
                    'expiration_date' => $doc->expiration_date,
                ];
            });

        $recentStudies = $documents->where('document_type_id', '2') // Cambia 'education' por el valor correcto
            ->sortByDesc('issue_date')
            ->take(2)
            ->map(function ($doc) {
                $metadata = json_decode($doc->metadata, true); // Decodificar el JSON de metadata
                return [
                    'document_name' => $doc->document_name,
                    'institution' => $metadata['institution'] ?? 'No especificado',
                    'degree' => $metadata['degree'] ?? 'No especificado',
                    'issue_date' => $doc->issue_date,
                    'expiration_date' => $doc->expiration_date,
                ];
            });

        $recentCourses = $documents->where('document_type_id', '3') // Cambia 'course' por el valor correcto
            ->sortByDesc('issue_date')
            ->take(2)
            ->map(function ($doc) {
                $metadata = json_decode($doc->metadata, true); // Decodificar el JSON de metadata
                return [
                    'document_name' => $doc->document_name,
                    'institution' => $metadata['institution'] ?? 'No especificado',
                    'hours' => $metadata['hours'] ?? 'No especificado',
                    'instructor' => $metadata['instructor'] ?? 'No especificado',
                    'issue_date' => $doc->issue_date,
                    'expiration_date' => $doc->expiration_date,
                ];
            });
        // Obtener competencias (document_type_id = 10)
        $competencies = $documents->where('document_type_id', 10)
            ->map(function ($doc) {
                $detail = json_decode($doc->detail, true); // Decodificar el JSON de detalle
                return [
                    'document_name' => $doc->document_name,
                    'skills' => $detail ?? ['No especificado']
                ];
            });

        // Obtener idiomas (document_type_id = 9)
        $languages = $documents->where('document_type_id', 9)
            ->map(function ($doc) {
                $detail = json_decode($doc->detail, true); // Decodificar el JSON de detalle
                return [
                    'document_name' => $doc->document_name,
                    'level' => $detail['level'] ?? 'No especificado'
                ];
            });

        // Obtener la información del departamento
        $department = $user->department;

        return response()->json([
            'id' => $user->id,
            'email' => $user->email,
            'department_id' => $user->department_id,
            'person_id' => $user->person_id,
            'roles' => $user->getRoleNames(), // Devuelve un array de roles
            'permissions' => $user->getAllPermissions()->pluck('name'), // Devuelve un array de permisos
            'person' => $person ? [
                'id' => $person->id,
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
                'resume_url' => $person->cv_path
                    ? URL::to('/pdf/' . basename($person->cv_path))
                    : null,
                'competencies' => $competencies->isEmpty() ? 'No hay competencias registradas' : $competencies,
                'languages' => $languages->isEmpty() ? 'No hay idiomas registrados' : $languages,
                'recent_jobs' => $recentJobs->isEmpty() ? 'No hay información de empleos' : $recentJobs,
                'recent_studies' => $recentStudies->isEmpty() ? 'No hay información de estudios' : $recentStudies,
                'recent_courses' => $recentCourses->isEmpty() ? 'No hay información de cursos' : $recentCourses,
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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('users.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validatedData = $request->validated();

        $user = new User();
        $user->name = $validatedData['name'];
        $user->email = $validatedData['email'];
        // Set other user properties as needed

        $user->save();

        return response()->json(['message' => 'User created successfully'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        try {
            $userData = $user->toArray();

            return response()->json([
                'status' => 'success',
                'data' => $userData
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve user data'
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return view('users.edit', ['user' => $user]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $validatedData = $request->validated();

        $user->update([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            // Add other fields as needed
        ]);

        return response()->json(['message' => 'User updated successfully'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {
            $user->delete();
            return response()->json(['message' => 'User deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete user'], 500);
        }
    }
}
