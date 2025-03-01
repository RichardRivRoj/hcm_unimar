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
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
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
        $sort = $request->input('sort', 'asc');

        // Consulta base con relaciones y columnas explícitas
        $query = Candidate::with([
            'persons',
            'vacancy.position',
            'status_application',
        ])->select('candidates.*'); // Seleccionar solo las columnas de candidates

        // Aplicar filtros
        if ($request->filled('status_application_id')) {
            $query->where('status_application_id', $request->status_application_id);
        }

        // Ordenar por nombre de la persona usando Eloquent
        $query->when($sort, function ($q) use ($sort) {
            $q->orderBy(
                Person::select('first_name')
                    ->whereColumn('persons.id', 'candidates.person_id'),
                $sort
            );
        });

        // Paginar los resultados
        $candidates = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $candidates->items(),
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
                'resume' => 'required|mimes:pdf',
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
                'documents.competencies' => 'array|max:3',
                'documents.languages' => 'array|max:3'
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

            // Subir la foto
            $resumePath = $request->file('resume')->store('public/pdf');
            $resumeUrl = FacadesStorage::url($resumePath);

            // Crear Persona
            $person = Person::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'birth_date' => $request->birth_date,
                'phone' => $request->phone,
                'file_path' => $photoUrl,
                'cv_path' => $resumeUrl,
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
                'resume_url' => asset($resumeUrl),
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
            'jobs' => 1,       // Empleos
            'studies' => 2,    // Estudios
            'courses' => 3,    // Cursos
            'competencies' => 10, // Competencias
            'languages' => 9    // Idiomas
        ];

        foreach ($documentTypes as $type => $documentTypeId) {
            if (!empty($documents[$type])) {
                foreach ($documents[$type] as $documentData) {

                    // Sanitizar fechas
                    $issueDate = $this->sanitizeDateInput($documentData['issue_date'] ?? null);
                    $expirationDate = $this->sanitizeDateInput($documentData['expiration_date'] ?? null);


                    $metadata = [];
                    $detail = null;

                    switch ($type) {
                        case 'jobs':
                            // Agregar responsabilidades a metadata
                            $metadata = [
                                'company_name' => $documentData['metadata']['company_name'] ?? null,
                                'position' => $documentData['metadata']['position'] ?? null,
                                'responsibilities' => $documentData['metadata']['responsibilities'] ?? null,
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

                        case 'competencies':
                            // Almacenar competencias en detail como JSON
                            $detail = isset($documentData['detail'])
                                ? json_encode($documentData['detail'])
                                : null;
                            break;

                        case 'languages':
                            // Acceder correctamente al nivel
                            $detail = isset($documentData['detail']['level'])
                                ? json_encode(['level' => $documentData['detail']['level']])
                                : null;
                            break;
                    }

                    Document::create([
                        'person_id' => $personId,
                        'document_type_id' => $documentTypeId,
                        'document_name' => $documentData['name'],
                        'issue_date' => $issueDate,
                        'expiration_date' => $expirationDate,
                        'detail' => $detail,
                        'metadata' => !empty($metadata) ? json_encode($metadata) : null,
                        'file_path' => $documentData['file_path'] ?? null,
                        'status' => 1
                    ]);
                }
            }
        }
    }

    // Nuevo método helper para sanitización
    private function sanitizeDateInput($date)
    {
        if (empty($date) || $date === '') {
            return null;
        }

        try {
            return Carbon::parse($date)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }


    //Mostrar un candidato específico.
    public function show($candidateId)
    {
        try {
            $candidate = Candidate::with([
                'persons.identificationtype',
                'persons.ethnicity',
                'persons.maritalstatus',
                'persons.gender',
                'persons.country',
                'persons.status',
                'persons.documents' => function ($query) {
                    $query->orderBy('created_at', 'desc')
                        ->with('documenttype');
                },
                'vacancy',
                'status_application'
            ])->findOrFail($candidateId);

            $person = $candidate->persons;
            $documents = $person->documents ?? collect();

            // Obtener los 3 documentos más recientes por tipo
            $filteredDocuments = $documents->groupBy('document_type_id')
                ->map(function ($group) {
                    return $group->take(3);
                })->flatten();

            // Generar URLs para foto y CV
            $photoUrl = $person->file_path
                ? route('photo.show', ['filename' => basename($person->file_path)])
                : null;

            $resumeUrl = $person->cv_path
                ? route('pdf.download', ['filename' => basename($person->cv_path)])
                : null;

            // Construir la respuesta
            return response()->json([
                'candidate_id' => $candidate->id,
                'person_id' => $candidate->person_id,
                'status_application' => $candidate->status_application,
                'vacancy' => $candidate->vacancy,
                'person' => array_merge($person->toArray(), [
                    'photo_url' => $photoUrl,
                    'resume_url' => $resumeUrl
                ]),
                'documents' => $filteredDocuments,
                'identification_type' => $person->identificationtype,
                'ethnicity' => $person->ethnicity,
                'marital_status' => $person->maritalstatus,
                'gender' => $person->gender,
                'country' => $person->country,
                'status' => $person->status
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Candidato no encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener la información'], 500);
        }
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

    public function updateStatus($candidateId, Request $request)
    {
        $request->validate(['status' => 'required|in:aceptado,rechazado']);

        // Buscar el candidato por su ID
        $candidate = Candidate::with(['persons', 'vacancy'])
            ->findOrFail($candidateId);

        // Obtener el estado de la aplicación
        $status = StatusApplication::where('name', ucfirst($request->status))->firstOrFail();

        // Actualizar el estado del candidato
        $candidate->update(['status_application_id' => $status->id]);

        // Verificar persona asociada
        if (!$candidate->persons) {
            Log::error("Candidato con ID {$candidateId} no tiene persona asociada");
            return response()->json(['error' => 'Candidato no válido'], 400);
        }

        // Verificar email
        if (empty($candidate->persons->email)) {
            Log::error("Candidato con ID {$candidateId} no tiene email registrado");
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

            // Enviar correo electrónico
            Mail::to($candidate->persons->email)->send($mailable);
        } catch (\Exception $e) {
            Log::error("Error enviando email: " . $e->getMessage());
            return response()->json(['error' => 'Error al enviar notificación'], 500);
        }

        return response()->json(['success' => true]);
    }
}
