<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\InterviewScheduled;
use App\Models\Agenda;
use App\Models\Candidate;
use App\Models\StatusApplication;
use App\Models\TypeAgenda;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AgendaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Consulta base con relaciones
        $query = Agenda::with([
            'candidate.persons', // Relación con Person (nombre, apellido, identificación)
            'candidate.vacancy', // Relación con Vacancy (vacante a la que se postuló)
            'typeagenda', // Relación con TypeAgenda (tipo de agenda)
            'status'
        ])
            ->latest(); // Ordenar por fecha de creación (más recientes primero)

        // Aplicar filtros
        if ($request->filled('status_id')) {
            $query->where('status_id', $request->status_id);
        }

        if ($request->filled('type_agenda_id')) {
            $query->where('type_agenda_id', $request->type_agenda_id); // Filtro por tipo de agenda
        }

        // Paginación de 10 en 10
        $agendas = $query->paginate(10);

        // Estructura de respuesta
        return response()->json([
            'success' => true,
            'data' => $agendas->items(), // Datos de las agendas
            'meta' => [
                'current_page' => $agendas->currentPage(),
                'last_page' => $agendas->lastPage(),
                'per_page' => $agendas->perPage(),
                'total' => $agendas->total(),
            ],
        ], 200);
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
        // Validar los datos del formulario
        $validated = $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'type_agenda_id' => 'required|exists:type_agendas,id',
            'scheduled_date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'location' => 'required|string|max:100',
            'status_id' => 'required|exists:statuses,id'
        ]);

        try {
            // Obtener el candidato y su información relacionada
            $candidate = Candidate::with('persons')->findOrFail($validated['candidate_id']);
            $typeAgenda = TypeAgenda::findOrFail($validated['type_agenda_id']);

            // Actualizar el estado de la aplicación a "En Progreso"
            $statusEnProgreso = StatusApplication::where('name', 'En Progreso')->firstOrFail();
            $candidate->update(['status_application_id' => $statusEnProgreso->id]);

            // Crear la agenda
            $agenda = Agenda::create($validated);

            // Convertir los datos en un array antes de enviarlos
            $agendaData = [
                'candidate' => [
                    'name' => $candidate->persons->first_name,
                ],
                'typeAgenda' => $typeAgenda->name,
                'scheduledDate' => Carbon::parse($agenda->scheduled_date)->format('d/m/Y'),
                'time' => Carbon::parse($agenda->time)->format('h:i A'),
                'location' => $agenda->location,
            ];

            // Enviar correo al candidato con los detalles de la agenda
            Mail::to($candidate->persons->email)->send(new InterviewScheduled($agendaData));

            return response()->json([
                'message' => 'Entrevista agendada exitosamente',
                'agenda' => $agenda,
                'candidate' => $candidate
            ], 201);
        } catch (\Exception $e) {
            Log::error("Error al agendar entrevista: " . $e->getMessage());
            return response()->json([
                'error' => 'Error al agendar la entrevista'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
