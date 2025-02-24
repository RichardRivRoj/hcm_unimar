<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IdentificationController extends BaseDocumentController
{
    protected $documentType = 6; // ID del tipo de documento

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

        // Obtener documentos de empleos directamente desde la relación
        $documents = $user->persons->documents()
            ->where('document_type_id', $this->documentType) // Usar número entero
            ->orderByDesc('issue_date')
            ->paginate(10);

        // Transformar los documentos
        $transformedDocuments = $documents->map(function ($doc) {

            $metadata = is_string($doc->metadata)
                ? json_decode($doc->metadata, true)
                : $doc->metadata;

            $fechaIFormateada = Carbon::parse($doc->issue_date)->format('d-m-Y');
            $fechaEFormateada = Carbon::parse($doc->expiration_date)->format('d-m-Y');
            return [
                'id' => $doc->id,
                'document_name' => $doc->document_name,
                'id_type' => $metadata['id_type'] ?? 'No especificado',
                'id_number' => $metadata['id_number'] ?? 'No especificado',
                'id_issuer' => $metadata['id_issuer'] ?? 'No especificado',
                'issue_date' => $fechaIFormateada,
                'expiration_date' => $fechaEFormateada  ?? 'Presente',
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

        $validatedData = $request->validate([
            'document_name' => 'required|string|max:255',
            'id_type' => 'required|string|max:255',
            'id_number' => 'required|string|max:255',
            'id_issuer' => 'required|string|max:255',
            'issue_date' => 'required|date',
            'expiration_date' => 'nullable|date|after_or_equal:issue_date',
            'file_path' => 'nullable|string|max:255',
        ]);

        // Crear el documento de empleo
        $document = $user->persons->documents()->create([
            'document_name' => $validatedData['document_name'],
            'document_type_id' => $this->documentType,
            'metadata' => json_encode([
                'id_type' => $validatedData['id_type'],
                'id_number' => $validatedData['id_number'],
                'id_issuer' => $validatedData['id_issuer'],
            ]),
            'issue_date' => Carbon::parse($validatedData['issue_date']),
            'expiration_date' => isset($validatedData['expiration_date']) ? Carbon::parse($validatedData['expiration_date']) : null,
            'file_path' => $validatedData['file_path'] ?? null,
            'status' => 1, // Estado inicial del documento
        ]);

        return response()->json([
            'message' => 'Empleo registrado con éxito',
            'data' => [
                'id' => $document->id,
                'document_name' => $document->document_name,
                'id_type' => $validatedData['id_type'],
                'id_number' => $validatedData['id_number'],
                'id_issuer' => $validatedData['id_issuer'],
                'issue_date' => $document->issue_date->format('d-m-Y'),
                'expiration_date' => $document->expiration_date ? $document->expiration_date->format('d-m-Y') : 'Presente',
                'file_path' => $document->file_path,
                'status' => $document->status,
            ]
        ], 201);
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
