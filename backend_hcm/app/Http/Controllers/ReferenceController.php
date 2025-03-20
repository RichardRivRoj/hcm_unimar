<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReferenceController extends BaseDocumentController
{

    protected $documentType = 8; // ID del tipo de documento

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'issue_date' => 'date',
        'expiration_date' => 'date',
    ];
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        // Obtener la persona asociada al usuario autenticado
        $person = $user->person;

        if (!$person) {
            return response()->json(['error' => 'Persona no encontrada'], 404);
        }

        // Obtener documentos asociados a la persona y filtrar por tipo de documento
        $documents = $person->documents()
            ->where('document_type_id', $this->documentType)
            ->with(['documentType', 'persons.identificationtype', 'persons.employee.contracts.department'])
            ->orderByDesc('issue_date')
            ->paginate(4);

        // Transformar los documentos
        $transformedDocuments = $documents->map(function ($doc) use ($person) {
            $metadata = is_string($doc->metadata)
                ? json_decode($doc->metadata, true)
                : $doc->metadata;

            // Calcular años de conocido
            $endDate = $doc->expiration_date ? Carbon::parse($doc->expiration_date) : now();
            $yearsKnown = Carbon::parse($doc->issue_date)->diffInYears($endDate);

            return [
                'id' => $doc->id,
                'document_name' => $doc->document_name,
                'referrer_name' => $metadata['referrer_name'] ?? 'No especificado',
                'referrer_identification' => $metadata['referrer_identification'] ?? 'No especificado',
                'department_name' => $metadata['department_name'] ?? 'No especificado',
                'issue_date' => Carbon::parse($doc->issue_date)->format('d-m-Y'),
                'expiration_date' => $doc->expiration_date
                    ? Carbon::parse($doc->expiration_date)->format('d-m-Y')
                    : 'Presente',
                'years_known' => round($yearsKnown),
                'document_created_at' => Carbon::parse($doc->created_at)->format('d-m-Y H:i'),

                // Información de la persona
                'person' => [
                    'identification_value' => $person->identification_value,
                    'identification_type' => $person->identificationtype->code ?? 'No especificado',
                    'full_name' => $person->first_name . ' ' . $person->last_name,
                ],

                // Departamento actual
                'current_department' => $person->employee->department->name ?? 'Sin departamento',
            ];
        });

        return response()->json([
            'data' => $transformedDocuments,
            'meta' => [
                'current_page' => $documents->currentPage(),
                'total_pages' => $documents->lastPage(),
                'total_items' => $documents->total()
            ]
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
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        // Validar los datos de entrada
        $validatedData = $request->validate([
            'document_name' => 'required|string|max:255',
            'referrer_name' => 'required|string|max:255',
            'referrer_identification' => 'required|string|max:255',
            'issue_date' => 'required|date',
            'expiration_date' => 'nullable|date|after_or_equal:issue_date',
            'file_path' => 'nullable|string|max:255',
        ]);

        // Obtener la persona asociada al usuario autenticado
        $person = $user->person;

        if (!$person) {
            return response()->json(['error' => 'Persona no encontrada'], 404);
        }

        DB::beginTransaction();

        try {
            $departmentName = 'Sin departamento';

            // Verificar si la persona tiene un empleado asociado
            if ($person->employee) {
                // Obtener el último contrato del empleado
                $latestContract = $person->employee->contracts()
                    ->latest()
                    ->with('department')
                    ->first();

                if ($latestContract && $latestContract->department) {
                    $departmentName = $latestContract->department->description;
                }
            }

            // Crear la referencia para la persona
            $document = $person->documents()->create([
                'document_name' => $validatedData['document_name'],
                'document_type_id' => $this->documentType,
                'metadata' => json_encode([
                    'referrer_name' => $validatedData['referrer_name'],
                    'referrer_identification' => $validatedData['referrer_identification'],
                    'department_name' => $departmentName,
                ]),
                'issue_date' => Carbon::parse($validatedData['issue_date']),
                'expiration_date' => $validatedData['expiration_date']
                    ? Carbon::parse($validatedData['expiration_date'])
                    : null,
                'file_path' => $validatedData['file_path'] ?? null,
                'status' => 1,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Referencia personal creada con éxito',
                'data' => [
                    'id' => $document->id,
                    'document_name' => $document->document_name,
                    'referrer_name' => $validatedData['referrer_name'],
                    'referrer_identification' => $validatedData['referrer_identification'],
                    'issue_date' => $document->issue_date->format('d-m-Y'),
                    'expiration_date' => $document->expiration_date
                        ? $document->expiration_date->format('d-m-Y')
                        : 'Presente',
                    'department_at_creation' => $departmentName,
                    'file_path' => $document->file_path,
                ]
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al crear la referencia: ' . $e->getMessage()
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
