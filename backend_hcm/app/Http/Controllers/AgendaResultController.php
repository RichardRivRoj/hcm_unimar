<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use App\Models\AgendaResult;
use App\Models\Candidate;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AgendaResultController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Obtener parámetros de la solicitud
            $search = $request->input('search'); // Filtro por nombre
            $sortBy = $request->input('sort_by', 'created_at'); // Ordenar por (default: created_at)
            $sortOrder = $request->input('sort_order', 'desc'); // Orden (default: desc)
            $vacancyId = $request->input('vacancy_id'); // Filtro por vacante

            // Consulta base con relaciones necesarias
            $query = AgendaResult::with([
                'agenda.candidate.persons',
                'agenda.typeAgenda',
                'agenda.candidate.vacancy.position' // Relación con vacancy y position
            ]);

            // Aplicar filtro por nombre del candidato
            if ($search) {
                $query->whereHas('agenda.candidate.persons', function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                });
            }

            // Aplicar filtro por vacante
            if ($vacancyId) {
                $query->whereHas('agenda.candidate', function ($q) use ($vacancyId) {
                    $q->where('vacancy_id', $vacancyId);
                });
            }

            // Ordenar por promedio general o fecha de creación
            if ($sortBy === 'average_score') {
                $query->orderBy('score', $sortOrder);
            } else {
                $query->orderBy('created_at', $sortOrder);
            }

            // Obtener todos los resultados sin paginar
            $allResults = $query->get();

            // Agrupar resultados por candidato
            $groupedResults = $allResults->groupBy('agenda.candidate_id');

            // Transformar los datos para la respuesta
            $transformed = $groupedResults->map(function ($group) {
                $firstResult = $group->first();
                $candidate = $firstResult->agenda->candidate;
                $vacancy = $candidate->vacancy;

                // Obtener hasta 4 evaluaciones más recientes
                $evaluations = $group->take(4)->map(function ($result) {
                    return [
                        'date' => $result->created_at->format('d/m/Y'),
                        'type' => $result->agenda->typeAgenda->name,
                        'score' => $result->score,
                        'comments' => $result->comments
                    ];
                });

                return [
                    'candidate_id' => $candidate->id,
                    'full_name' => $candidate->persons->first_name . ' ' . $candidate->persons->last_name,
                    'identification' => $candidate->persons->identification_value,
                    'total_evaluations' => $group->count(),
                    'average_score' => $group->avg('score'),
                    'evaluations' => $evaluations,
                    'last_evaluation' => $group->first()->created_at->format('d/m/Y'),
                    'vacancy' => [
                        'id' => $vacancy->id,
                        'title' => $vacancy->title,
                        'position' => $vacancy->position->description // Nombre del puesto
                    ]
                ];
            });

            // Paginar los resultados transformados manualmente
            $page = $request->input('page', 1); // Página actual (default: 1)
            $perPage = 10; // Resultados por página
            $paginatedResults = $transformed->slice(($page - 1) * $perPage, $perPage)->values();

            return response()->json([
                'success' => true,
                'data' => $paginatedResults,
                'meta' => [
                    'current_page' => (int)$page,
                    'last_page' => ceil($transformed->count() / $perPage),
                    'per_page' => $perPage,
                    'total' => $transformed->count(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching results',
                'error' => $e->getMessage()
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
        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'score' => 'required|numeric|min:0|max:10',
            'comments' => 'required|string|max:500',
            'agenda_id' => 'required|exists:agendas,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Obtener la agenda relacionada
            $agenda = Agenda::findOrFail($request->agenda_id);

            // Verificar si ya existe un resultado para esta agenda
            if ($agenda->agendaresult) {
                return response()->json([
                    'success' => false,
                    'message' => 'Esta agenda ya tiene un resultado registrado'
                ], 409);
            }

            // Crear el resultado de la agenda
            $agendaResult = AgendaResult::create([
                'score' => $request->score,
                'comments' => $request->comments,
                'agenda_id' => $agenda->id
            ]);

            // Cargar relaciones para la respuesta
            $agendaResult->load('agenda');

            return response()->json([
                'success' => true,
                'message' => 'Resultado de agenda registrado exitosamente',
                'data' => $agendaResult
            ], 201);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Agenda no encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar el resultado',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            // Obtener el candidato con todas las relaciones necesarias
            $candidate = Candidate::with([
                'persons',
                'vacancy.position',
                'vacancy.department',
                'vacancy.mode',
                'vacancy.status',
                'status_application', // Nueva relación agregada
                'agenda.typeagenda', // Cargar todas las agendas del candidato
                'agenda.agendaresult', // Cargar los resultados de las agendas
                'agenda.status'
            ])->findOrFail($id);

            // Calcular el promedio general de todas las agendas
            $allScores = $candidate->agenda->flatMap(function ($agenda) {
                return $agenda->agendaresult ? [$agenda->agendaresult->score] : [];
            });

            $averageScore = $allScores->avg();

            // Estructurar la respuesta
            $response = [
                'candidate' => [
                    'personal_info' => [
                        'full_name' => $candidate->persons->first_name . ' ' . $candidate->persons->last_name,
                        'identification' => $candidate->persons->identification_value,
                        'email' => $candidate->persons->email,
                        'phone' => $candidate->persons->phone,
                        'birth_date' => $candidate->persons->birth_date,
                        'gender' => $candidate->persons->gender->name ?? null,
                        'nationality' => $candidate->persons->country->name ?? null
                    ],
                    'vacancy_info' => [
                        'position' => $candidate->vacancy->position->description,
                        'department' => $candidate->vacancy->department->name,
                        'vacancy_title' => $candidate->vacancy->title,
                        'modality' => $candidate->vacancy->mode->name ?? null,
                        'status' => $candidate->vacancy->status->name ?? null
                    ],
                    'status_application' => [ // Nueva información agregada
                        'id' => $candidate->status_application->id ?? null,
                        'name' => $candidate->status_application->name ?? null
                    ]
                ],
                'process_details' => [
                    'total_agendas' => $candidate->agenda->count(),
                    'average_score' => round($averageScore, 2),
                    'agendas' => $candidate->agenda->map(function ($agenda) {
                        return [
                            'type' => $agenda->typeagenda->name,
                            'scheduled_date' => $agenda->scheduled_date,
                            'time' => $agenda->time,
                            'status' => $agenda->status->name,
                            'score' => $agenda->agendaresult->score ?? 'N/A',
                            'comments' => $agenda->agendaresult->comments ?? 'Sin comentarios',
                            'location' => $agenda->location
                        ];
                    }),
                    'timeline' => $candidate->agenda->sortBy('scheduled_date')->values()->map(function ($agenda) {
                        return [
                            'date' => $agenda->scheduled_date,
                            'event' => $agenda->typeagenda->name,
                            'status' => $agenda->status->name
                        ];
                    })
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $response
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los detalles del proceso',
                'error' => $e->getMessage()
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
