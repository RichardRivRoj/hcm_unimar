<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\ApplicationAccepted;
use App\Mail\ApplicationRejected;
use Illuminate\Http\Request;
use App\Models\Candidate;
use App\Models\Document;
use App\Models\Person;
use App\Models\StatusApplication;
use App\Models\Vacancy;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage as FacadesStorage;
use Illuminate\Support\Facades\Validator;

class CandidateController extends Controller
{
    /**
     * Listar todos los candidatos registrados.
     */
    public function index(Request $request)
    {
        // Obtener los parámetros de filtrado
        $sort = $request->input('sort', 'asc'); // Orden por defecto: A-Z

        // Consulta base con relaciones
        $query = Candidate::with([
            'persons', // Relación con Persons
            'vacancy', // Relación con Vacancy
            'status_application', // Relación con StatusApplication
        ]);

        // Aplicar filtros
        if ($request->filled('status_application_id')) {
            $query->where('status_application_id', $request->status_application_id);
        }

        // Ordenar por nombre de la persona
        if ($sort === 'asc') {
            $query->join('persons', 'candidates.person_id', '=', 'persons.id')
                ->orderBy('persons.first_name', 'asc');
        } else {
            $query->join('persons', 'candidates.person_id', '=', 'persons.id')
                ->orderBy('persons.first_name', 'desc');
        }

        // Paginar los resultados (20 por página)
        $candidates = $query->paginate(20);

        // Retornar la respuesta en formato JSON
        // Estructura de respuesta
        return response()->json([
            'success' => true,
            'data' => $candidates->items(), // Datos de las vacantes
            'meta' => [
                'current_page' => $candidates->currentPage(),
                'last_page' => $candidates->lastPage(),
                'per_page' => $candidates->perPage(),
                'total' => $candidates->total(),
            ],
        ], 200);
    }


    /**
     * Guardar los datos de un nuevo candidato.
     */
    public function store(Request $request, $vacancyId)
    {
        DB::beginTransaction();

        try {
            // Validar datos principales
            $validator = Validator::make($request->all(), [
                'first_name' => 'required|max:200',
                'last_name' => 'required|max:200',
                'email' => 'required|email|unique:persons,email',
                'phone' => 'required|max:200',
                'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
                'identification_value' => 'required|unique:persons,identification_value',
                'vacancy_id' => 'required|exists:vacancies,id',
                'ethnicity_id' => 'nullable|exists:ethnicities,id',
                'identification_type_id' => 'nullable|exists:identification_types,id',
                'marital_status_id' => 'nullable|exists:marital_statuses,id',
                'gender_id' => 'nullable|exists:genders,id',
                'countries_id' => 'nullable|exists:countries,id',
                'documents' => 'required|json',
                'documents.studies' => 'array|max:2',
                'documents.courses' => 'array|max:2',
                'documents.jobs' => 'array|max:2',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Subir la foto
            $photoPath = $request->file('photo')->store('public/photos');
            $photoUrl = FacadesStorage::url($photoPath);

            // Crear Persona
            $person = Person::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'birth_date' => $request->birth_date,
                'phone' => $request->phone,
                'file_path' => $photoUrl,
                'summary' => $request->summary,
                'identification_value' => $request->identification_value,
                'identification_type_id' => $request->identification_type_id,
                'ethnicity_id' => $request->ethnicity_id,
                'marital_status_id' => $request->marital_status_id,
                'gender_id' => $request->gender_id,
                'countries_id' => $request->countries_id,
                'status_id' => $request->status_id ?? 1,
            ]);

            // Crear Documentos (Estudios, Cursos, Empleos)
            $documents = json_decode($request->documents, true);
            $this->createDocuments($person->id, $documents);

            // Crear Candidato
            $candidate = Candidate::create([
                'person_id' => $person->id,
                'vacancy_id' => $vacancyId,
                'status_application_id' => $request->status_application_id ?? 1,
            ]);

            DB::commit();

            // Cargar documentos recién creados con la relación
            $person->load('documents');

            return response()->json([
                'success' => true,
                'photo_url' => asset($photoUrl),
                'data' => [
                    'person' => $person,
                    'candidate' => $candidate,
                    'documents' => $person->documents
                ]
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error creating candidate: ' . $e->getMessage()
            ], 500);
        }
    }

    private function createDocuments($personId, $documents)
    {
        $documentTypes = [
            'jobs' => 1,    // Empleos
            'studies' => 2, // Estudios
            'courses' => 3  // Cursos
        ];

        foreach ($documentTypes as $type => $documentTypeId) {
            if (!empty($documents[$type])) {
                foreach ($documents[$type] as $documentData) {

                    // Validar metadatos según tipo
                    $metadata = [];
                    switch ($type) {
                        case 'jobs':
                            $metadata = [
                                'company_name' => $documentData['metadata']['company_name'] ?? null,
                                'position' => $documentData['metadata']['position'] ?? null,
                            ];
                            break;

                        case 'studies':
                            $metadata = [
                                'institution' => $documentData['metadata']['institution'] ?? null,
                                'degree' => $documentData['metadata']['degree'] ?? null,
                            ];
                            break;

                        case 'courses':
                            $metadata = [
                                'hours' => $documentData['metadata']['hours'] ?? null,
                                'instructor' => $documentData['metadata']['instructor'] ?? null,
                            ];
                            break;
                    }

                    Document::create([
                        'person_id' => $personId,
                        'document_type_id' => $documentTypeId,
                        'document_name' => $documentData['name'],
                        'issue_date' => $documentData['issue_date'] ?? null,
                        'expiration_date' => $documentData['expiration_date'] ?? null,
                        'metadata' => json_encode($metadata),
                        'file_path' => $documentData['file_path'] ?? null,
                        'status' => 1
                    ]);
                }
            }
        }
    }


    //Mostrar un candidato específico.
    public function show($id)
    {

        // Obtener el candidato con todas las relaciones necesarias
        $candidate = Candidate::with([
            'persons.identificationtype', // Tipo de identificación
            'persons.ethnicity',          // Etnia
            'persons.maritalstatus',      // Estado civil
            'persons.gender',              // Género
            'persons.country',             // País
            'persons.status',              // Estado de la persona
            'persons.documents.documenttype', // Documentos y su tipo
            'vacancy',                    // Vacante asociada
            'status_application'           // Estado de la aplicación
        ])->findOrFail($id);

        // Obtener las relaciones individuales para una mejor estructuración
        $person = $candidate->persons;
        $documents = $person->documents ?? [];
        $identificationType = $person->identificationtype;
        $ethnicity = $person->ethnicity;
        $maritalStatus = $person->maritalstatus;
        $gender = $person->gender;
        $country = $person->country;
        $status = $person->status;

        // Verificar si existe 'person' antes de acceder a sus propiedades
        if ($candidate->persons) {
            // Generar URL de la foto solo si existe file_path
            $candidate->persons->photo_url = $candidate->persons->file_path
                ? route('photo.show', ['filename' => basename($candidate->persons->file_path)])
                : null;
        } else {
            // Si no hay persona asociada, establecer photo_url como null
            $candidate->person = (object) ['photo_url' => null];
        }

        // Construir la respuesta JSON
        return response()->json([
            'candidate' => $candidate,
            'status_application' => $candidate->status_application,
            'vacancy' => $candidate->vacancy,
            'person' => $person,
            'documents' => $documents,
            'identification_type' => $identificationType,
            'ethnicity' => $ethnicity,
            'marital_status' => $maritalStatus,
            'gender' => $gender,
            'country' => $country,
            'status' => $status
        ]);
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

    public function updateStatus($id, Request $request)
    {
        $request->validate(['status' => 'required|in:aceptado,rechazado']);

        // Cargar relaciones CORRECTAMENTE (person en singular)
        $candidate = Candidate::with(['persons', 'vacancy'])->findOrFail($id);

        $status = StatusApplication::where('name', ucfirst($request->status))->firstOrFail();

        $candidate->update(['status_application_id' => $status->id]);

        // Verificar persona asociada (en singular)
        if (!$candidate->persons) {
            Log::error("Candidato {$id} no tiene persona asociada");
            return response()->json(['error' => 'Candidato no válido'], 400);
        }

        // Verificar email (acceder en singular)
        if (empty($candidate->persons->email)) {
            Log::error("Candidato {$id} no tiene email registrado");
            return response()->json(['error' => 'No hay email asociado'], 400);
        }

        try {
            // Crear mailable con datos específicos
            $mailData = [
                'name' => $candidate->persons->first_name,
                'puesto' => $candidate->vacancy->title,
            ];

            $mailable = $request->status === 'aceptado'
                ? new ApplicationAccepted($mailData)
                : new ApplicationRejected($mailData);

            Mail::to($candidate->persons->email)->send($mailable);
        } catch (\Exception $e) {
            Log::error("Error enviando email: " . $e->getMessage());
            return response()->json(['error' => 'Error al enviar notificación'], 500);
        }

        return response()->json(['success' => true]);
    }
}
