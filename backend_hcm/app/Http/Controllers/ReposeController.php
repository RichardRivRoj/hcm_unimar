<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReposeController extends Controller
{
    protected $documentType = 7; // ID del tipo de documento

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'issue_date' => 'date',
        'expiration_date' => 'date',
    ];
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        // Obtener documentos de empleos directamente desde la relación
        $documents = $user->person->documents()
            ->where('document_type_id', $this->documentType) // Usar número entero
            ->orderByDesc('issue_date')
            ->paginate(6);

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
                'reason' => $metadata['reason'] ?? 'No especificado',
                'doctor_name' => $metadata['doctor_name'] ?? 'No especificado',
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
        //
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
