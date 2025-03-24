<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\InterviewScheduled;
use App\Mail\InterviewUpdated;
use App\Models\Agenda;
use App\Models\Candidate;
use App\Models\Status;
use App\Models\StatusApplication;
use App\Models\TypeAgenda;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class AgendaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $candidate_id)
    {
        // Validar que se proporcione el candidate_id
        if (!$candidate_id) {
            return response()->json([
                'success' => false,
                'message' => 'The candidate id field is required.',
            ], 422);
        }

        // Consulta base con relaciones
        $query = Agenda::with([
            'candidate.persons', // Relación con Person (nombre, apellido, identificación)
            'candidate.vacancy', // Relación con Vacancy (vacante a la que se postuló)
            'typeagenda', // Relación con TypeAgenda (tipo de agenda)
            'status' // Relación con Status (estado de la agenda)
        ])
            ->where('candidate_id', $candidate_id); // Filtrar por candidato

        // Aplicar filtro por tipo de agenda (si se proporciona)
        if ($request->has('type_agenda') && $request->type_agenda) {
            $query->where('type_agenda_id', $request->type_agenda);
        }

        // Aplicar filtro por estado (si se proporciona)
        if ($request->has('status') && $request->status) {
            $query->where('status_id', $request->status);
        }

        // Ordenar por fecha de creación (más recientes primero)
        $query->latest();

        // Paginación (10 elementos por página por defecto)
        $perPage = $request->has('per_page') ? $request->per_page : 10;
        $agendas = $query->paginate($perPage);

        // Formatea la hora para cada agenda
        $formattedAgendas = $agendas->getCollection()->map(function ($agenda) {
            $time = Carbon::createFromFormat('H:i:s', $agenda->time);
            $agenda->formatted_time = $time->locale('es_VE')->isoFormat('h:mm A'); // Formato 12h con "a. m." o "p. m."
            return $agenda;
        });

        $agendas->setCollection($formattedAgendas);

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
        // Generar horarios válidos
        $validTimes = $this->getValidTimeSlots();

        // Validar los datos del formulario
        $validated = $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'type_agenda_id' => [
                'required',
                'exists:type_agendas,id',
                function ($attribute, $value, $fail) use ($request) {
                    $existingAgenda = Agenda::where('candidate_id', $request->candidate_id)
                        ->where('type_agenda_id', $value)
                        ->exists();

                    if ($existingAgenda) {
                        $fail('Ya existe una agenda de este tipo para el candidato.');
                    }
                }
            ],
            'scheduled_date' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $scheduledDate = Carbon::parse($value)->startOfDay();
                    $today = Carbon::today()->startOfDay();

                    if ($scheduledDate->lt($today)) {
                        $fail('La fecha no puede ser anterior a la fecha actual.');
                    }
                }
            ],
            'time' => [
                'required',
                'date_format:H:i',
                Rule::in($validTimes),
                function ($attribute, $value, $fail) use ($request) {
                    $exists = Agenda::where('scheduled_date', $request->scheduled_date)
                        ->where('time', $value)
                        ->exists();

                    if ($exists) {
                        $fail('Horario no disponible.');
                    }
                },
                function ($attribute, $value, $fail) use ($request) {
                    $scheduledDateTime = Carbon::parse($request->scheduled_date . ' ' . $value);

                    if ($scheduledDateTime->isBefore(now()->addHour())) {
                        $fail('Debe haber al menos 1 hora de anticipación.');
                    }
                }
            ],
            'location' => 'required|string|max:100',
            'status_id' => 'required|exists:statuses,id'
        ]);

        DB::beginTransaction();

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
                'candidate' => $candidate->persons->first_name . ' ' . $candidate->persons->last_name,
                'typeAgenda' => $typeAgenda->name,
                'scheduledDate' => Carbon::parse($agenda->scheduled_date)->format('d/m/Y'),
                'time' => Carbon::parse($agenda->time)->format('h:i A'),
                'location' => $agenda->location,
            ];

            // Enviar correo al candidato con los detalles de la agenda
            Mail::to($candidate->persons->email)->send(new InterviewScheduled($agendaData));

            DB::commit();

            return response()->json([
                'message' => 'Entrevista agendada exitosamente',
                'agenda' => $agenda,
                'candidate' => $candidate
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error al agendar entrevista: " . $e->getMessage());
            return response()->json([
                'error' => 'Error al agendar la entrevista',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function getValidTimes()
    {
        return response()->json($this->getValidTimeSlots());
    }

    // Generador de horarios válidos
    private function getValidTimeSlots()
    {
        $slots = [];
        $startMorning = Carbon::createFromTime(8, 0);
        $endMorning = Carbon::createFromTime(11, 30);
        $startAfternoon = Carbon::createFromTime(13, 30);
        $endOfWorkday = Carbon::createFromTime(16, 30);

        // Generar horarios mañana
        $current = $startMorning->copy();
        while ($current <= $endMorning) {
            $slots[] = $current->format('H:i');
            $current->addMinutes(30);
        }

        // Generar horarios tarde
        $current = $startAfternoon->copy();
        while ($current <= $endOfWorkday) {
            $slots[] = $current->format('H:i');
            $current->addMinutes(30);
        }

        return $slots;
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Cargar la agenda con todas las relaciones necesarias
        $agenda = Agenda::with([
            'typeagenda', // Tipo de agenda
            'candidate.persons.identificationtype', // Candidato, persona y tipo de identificación
            'candidate.persons.ethnicity', // Etnia
            'candidate.persons.gender', // Género
            'candidate.persons.country', // País
            'candidate.persons.maritalstatus', // Estado civil
            'candidate.vacancy.mode', // Vacante y modalidad
            'candidate.vacancy.position',
            'status', // Estado de la agenda
        ])->findOrFail($id);

        // Verificar si la agenda existe
        if (!$agenda) {
            return response()->json(['message' => 'Agenda no encontrada'], 404);
        }

        $formattedTime = Carbon::parse($agenda->time)
            ->locale('es_VE')
            ->settings(['formatFunction' => 'translatedFormat'])
            ->format('g:i A');

        // Forzar formato español si persiste el problema
        $ampm = Carbon::parse($agenda->time)->format('A') === 'AM' ? 'a. m.' : 'p. m.';
        $formattedTime = Carbon::parse($agenda->time)->format('g:i') . ' ' . $ampm;

        // Formatear la respuesta con los datos necesarios
        $response = [
            'agenda' => [
                'id' => $agenda->id,
                'scheduled_date' => $agenda->scheduled_date,
                'time_raw' => $agenda->time, // Valor original de la base de datos
                'time' => $formattedTime,
                'location' => $agenda->location,
                'status_id' => $agenda->status->id, // <-- Nuevo campo
                'status' => $agenda->status->name,
                'type_agenda_id' => $agenda->typeagenda->id, // <-- Nuevo campo
                'type_agenda' => $agenda->typeagenda->name,
                'has_rating' => $agenda->agendaresult()->exists(), // Verificar si tiene resultados
            ],
            'candidate' => [
                'id' => $agenda->candidate->id,
                'person' => [
                    'first_name' => $agenda->candidate->persons->first_name,
                    'last_name' => $agenda->candidate->persons->last_name,
                    'email' => $agenda->candidate->persons->email,
                    'phone' => $agenda->candidate->persons->phone,
                    'identification_value' =>  $agenda->candidate->persons->identificationtype->code . ' - ' . $agenda->candidate->persons->identification_value,
                    'ethnicity' => $agenda->candidate->persons->ethnicity->name, // Asumiendo que el modelo Ethnicity tiene un campo 'name'
                    'gender' => $agenda->candidate->persons->gender->name ?? 'NA', // Asumiendo que el modelo Gender tiene un campo 'name'
                    'country' => $agenda->candidate->persons->country->name, // Asumiendo que el modelo Country tiene un campo 'name'
                    'marital_status' => $agenda->candidate->persons->maritalstatus->name, // Asumiendo que el modelo MaritalStatus tiene un campo 'name'
                ],
            ],
            'vacancy' => [
                'id' => $agenda->candidate->vacancy->id,
                'title' => $agenda->candidate->vacancy->position->description,
                'description' => $agenda->candidate->vacancy->description,
                'requirements' => $agenda->candidate->vacancy->requirements,
                'responsibility' => $agenda->candidate->vacancy->responsibility,
                'num_vacancy' => $agenda->candidate->vacancy->num_vacancy,
                'mode' => $agenda->candidate->vacancy->mode->name, // Asumiendo que el modelo Modality tiene un campo 'name'
            ],
        ];

        // Retornar la respuesta en formato JSON
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
        // Generar horarios válidos
        $validTimes = $this->getValidTimeSlots();

        // Validar los datos del formulario
        $validated = $request->validate([
            'type_agenda_id' => [
                'required',
                'exists:type_agendas,id',
                function ($attribute, $value, $fail) use ($request, $id) {
                    $existingAgenda = Agenda::where('candidate_id', Agenda::find($id)->candidate_id)
                        ->where('type_agenda_id', $value)
                        ->where('id', '!=', $id)
                        ->exists();

                    if ($existingAgenda) {
                        $fail('Ya existe una agenda de este tipo para el candidato.');
                    }
                }
            ],
            'scheduled_date' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $scheduledDate = Carbon::parse($value)->startOfDay();
                    $today = Carbon::today()->startOfDay();

                    if ($scheduledDate->lt($today)) {
                        $fail('La fecha no puede ser anterior a la fecha actual.');
                    }
                }
            ],
            'time' => [
                'required',
                'date_format:H:i',
                Rule::in($validTimes),
                function ($attribute, $value, $fail) use ($request, $id) {
                    $exists = Agenda::where('scheduled_date', $request->scheduled_date)
                        ->where('time', $value)
                        ->where('id', '!=', $id)
                        ->exists();

                    if ($exists) {
                        $fail('Horario no disponible.');
                    }
                },
                function ($attribute, $value, $fail) use ($request) {
                    $scheduledDateTime = Carbon::parse($request->scheduled_date . ' ' . $value);

                    if ($scheduledDateTime->isToday() && $scheduledDateTime->isBefore(now()->addHour())) {
                        $fail('Debe haber al menos 1 hora de anticipación para eventos hoy.');
                    }
                }
            ],
            'location' => 'required|string|max:255',
            'status_id' => 'required|exists:statuses,id'
        ]);

        DB::beginTransaction();

        try {
            // Buscar la agenda con sus relaciones
            $agenda = Agenda::with(['candidate.persons', 'typeagenda'])->findOrFail($id);

            // Actualizar los datos
            $agenda->update($validated);

            // Obtener datos actualizados
            $agenda->refresh();

            // Si cambió el estado a "En Progreso"
            if ($agenda->status_id == StatusApplication::where('name', 'En Progreso')->first()->id) {
                $agenda->candidate->update(['status_application_id' => $agenda->status_id]);
            }

            // Preparar datos para el correo
            $emailData = [
                'candidate_name' => $agenda->candidate->persons->first_name . ' ' . $agenda->candidate->persons->last_name,
                'type_agenda' => $agenda->typeagenda->name,
                'scheduled_date' => Carbon::parse($agenda->scheduled_date)->format('d/m/Y'),
                'time' => Carbon::parse($agenda->time)->format('h:i A'),
                'location' => $agenda->location,
                'changes' => $request->input('changes_notification')
            ];

            // Enviar correo al candidato
            Mail::to($agenda->candidate->persons->email)
                ->send(new InterviewUpdated($emailData));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Agenda actualizada exitosamente',
                'data' => $agenda
            ], 200);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Agenda no encontrada'
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error actualizando agenda: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la agenda',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            // Buscar la agenda
            $agenda = Agenda::findOrFail($id);

            // Cambiar el estado a "inactivo"
            $agenda->update([
                'status_id' => Status::where('name', 'Inactivo')->first()->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Agenda desactivada exitosamente',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al desactivar la agenda',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
