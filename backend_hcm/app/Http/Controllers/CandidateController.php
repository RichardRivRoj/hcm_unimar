<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Candidate;
use App\Models\Person;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CandidateController extends Controller
{
    /**
     * Listar todos los candidatos registrados.
     */
    public function index(Request $request)
    {
    // Iniciar la consulta con las relaciones necesarias
    //$query = JobApplication::with(['candidate', 'jobposition']);

    // Filtro opcional por vacante (job_position_id)
    //if ($request->has('job_position_id')) {
      //  $query->where('job_position_id', $request->job_position_id);
    //}

    // Filtro opcional por estado (status)
    //if ($request->has('status')) {
     //   $query->where('status', $request->status);
    //}

    // Paginación para evitar grandes cantidades de datos
    //$applications = $query->paginate(10);

    //return response()->json($applications, 200);
    }


    /**
     * Guardar los datos de un nuevo candidato.
     */
    public function store(Request $request, $vacancyId)
    {
        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:200',
            'last_name' => 'required|string|max:200',
            'email' => 'required|email|unique:persons,email',
            'birth_date' => 'nullable|date',
            'phone' => 'nullable|string|max:20',
            'identification_value' => 'required|string|max:50|unique:persons,identification_value',
            'identification_type_id' => 'nullable|exists:identification_types,id',
            'ethnicity_id' => 'nullable|exists:ethnicities,id',
            'marital_status_id' => 'nullable|exists:marital_statuses,id',
            'gender_id' => 'nullable|exists:genders,id',
            'countries_id' => 'nullable|exists:countries,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Crear la persona
            $person = Person::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'birth_date' => $request->birth_date,
                'phone' => $request->phone,
                'identification_value' => $request->identification_value,
                'identification_type_id' => $request->identification_type_id,
                'ethnicity_id' => $request->ethnicity_id,
                'marital_status_id' => $request->marital_status_id,
                'gender_id' => $request->gender_id,
                'countries_id' => $request->countries_id,
                'status_id' => 1 // Estado por defecto
            ]);

            // Crear el candidato
            Candidate::create([
                'person_id' => $person->id,
                'vacancy_id' => $vacancyId,
                'status_application_id' => 1 // Estado de aplicación: Pendiente
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Candidato registrado exitosamente',
                'data' => [
                    'person' => $person,
                    'candidate' => $person->candidate
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Error al registrar el candidato: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar un candidato específico.
    *public function show($id)
    *{
    *
    *    // Buscar la aplicación de trabajo con la relación 'candidate' y 'jobPosition'
    *    $jobApplication = JobApplication::with(['candidate', 'jobPosition'])
    *        ->where('id', $id) // Filtrar por el ID de la aplicación
     *       ->firstOrFail(); // Devuelve el primer registro o 404 si no existe
    *
    *    // Devolver la información del candidato y la vacante asociada
     *   return response()->json([
      *      'id' => $jobApplication->id,
       *     'candidate' => [
        *        'first_name' => $jobApplication->candidate->first_name,
        *        'last_name' => $jobApplication->candidate->last_name,
        *        'email' => $jobApplication->candidate->email,
        *        'phone' => $jobApplication->candidate->phone,
        *        'cv_path' => $jobApplication->candidate->cv_path, // Asumimos que la ruta del CV está aquí
        *    ],
        *    'jobPosition' => [
        *        'id' => $jobApplication->jobPosition->id,
        *        'title' => $jobApplication->jobPosition->title, // El título del puesto
        *        'description' => $jobApplication->jobPosition->description, // Descripción del puesto si es necesario
       *     ],
      *      'status' => $jobApplication->status, // Estado de la aplicación
      *      'created_at' => $jobApplication->created_at->toDateTimeString(),
     *       'updated_at' => $jobApplication->updated_at->toDateTimeString(),
     *   ], 200);
    *}
    */
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
