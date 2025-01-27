<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Candidate;
use App\Models\JobApplication;
use App\Models\JobPosition;

class CandidateController extends Controller
{
    /**
     * Listar todos los candidatos registrados.
     */
    public function index(Request $request)
{
    // Iniciar la consulta con las relaciones necesarias
    $query = JobApplication::with(['candidate', 'jobposition']);

    // Filtro opcional por vacante (job_position_id)
    if ($request->has('job_position_id')) {
        $query->where('job_position_id', $request->job_position_id);
    }

    // Filtro opcional por estado (status)
    if ($request->has('status')) {
        $query->where('status', $request->status);
    }

    // Paginación para evitar grandes cantidades de datos
    $applications = $query->paginate(10);

    return response()->json($applications, 200);
}


    /**
     * Guardar los datos de un nuevo candidato.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:candidates,email',
            'phone' => 'required|string|max:15',
            'cv_path' => 'required|file|mimes:pdf,jpg,png|max:2048',
            'job_position_id' => 'required|exists:job_positions,id',
        ]);
    
        // Manejo del archivo del CV
        $cvPath = $request->file('cv_path')->store('cvs', 'public'); // Guardar el CV en el sistema
    
        // Crear el candidato
        $candidate = Candidate::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'cv_path' => $cvPath,
        ]);
    
        // Crear la relación en la tabla intermedia `job_applications`
        $jobApplication = JobApplication::create([
            'candidate_id' => $candidate->id,
            'job_position_id' => $validated['job_position_id'],
            'status' => 'pending', // Estado inicial: pendiente
        ]);
    
        return response()->json([
            'message' => 'Postulación realizada con éxito',
            'candidate' => $candidate,
            'job_application' => $jobApplication,
        ], 201);
    }

    /**
     * Mostrar un candidato específico.
     */
    public function show($id)
    {
    
        // Buscar la aplicación de trabajo con la relación 'candidate' y 'jobPosition'
        $jobApplication = JobApplication::with(['candidate', 'jobPosition'])
            ->where('id', $id) // Filtrar por el ID de la aplicación
            ->firstOrFail(); // Devuelve el primer registro o 404 si no existe

        // Devolver la información del candidato y la vacante asociada
        return response()->json([
            'id' => $jobApplication->id,
            'candidate' => [
                'first_name' => $jobApplication->candidate->first_name,
                'last_name' => $jobApplication->candidate->last_name,
                'email' => $jobApplication->candidate->email,
                'phone' => $jobApplication->candidate->phone,
                'cv_path' => $jobApplication->candidate->cv_path, // Asumimos que la ruta del CV está aquí
            ],
            'jobPosition' => [
                'id' => $jobApplication->jobPosition->id,
                'title' => $jobApplication->jobPosition->title, // El título del puesto
                'description' => $jobApplication->jobPosition->description, // Descripción del puesto si es necesario
            ],
            'status' => $jobApplication->status, // Estado de la aplicación
            'created_at' => $jobApplication->created_at->toDateTimeString(),
            'updated_at' => $jobApplication->updated_at->toDateTimeString(),
        ], 200);
    }

    /**
     * Actualizar el estado de un candidato (para avanzar en el proceso).
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:applied,interview,sent_offer,selected,rejected',
        ]);

        $candidate = Candidate::findOrFail($id);
        $candidate->update(['status' => $validated['status']]);

        return response()->json(['message' => 'Estado del candidato actualizado correctamente.', 'candidate' => $candidate]);
    }

    /**
     * Eliminar un candidato específico.
     */
    public function destroy($id)
    {
        $candidate = Candidate::findOrFail($id);
        $candidate->delete();

        return response()->json(['message' => 'Candidato eliminado correctamente.']);
    }
}
