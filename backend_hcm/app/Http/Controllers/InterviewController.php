<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Interview;

class InterviewController extends Controller
{
    /**
     * Listar todas las entrevistas agendadas.
     */
    public function index()
    {
        $interviews = Interview::all();
        return response()->json($interviews);
    }

    /**
     * Agendar una nueva entrevista.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'date' => 'required|date',
            'type' => 'required|string|in:administrative,psychological,medical',
            'notes' => 'nullable|string',
        ]);

        $interview = Interview::create($validated);

        return response()->json(['message' => 'Entrevista agendada correctamente.', 'interview' => $interview]);
    }

    /**
     * Mostrar los detalles de una entrevista específica.
     */
    public function show($id)
    {
        $interview = Interview::findOrFail($id);
        return response()->json($interview);
    }

    /**
     * Actualizar una entrevista.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'type' => 'required|string|in:administrative,psychological,medical',
            'notes' => 'nullable|string',
        ]);

        $interview = Interview::findOrFail($id);
        $interview->update($validated);

        return response()->json(['message' => 'Entrevista actualizada correctamente.', 'interview' => $interview]);
    }

    /**
     * Eliminar una entrevista.
     */
    public function destroy($id)
    {
        $interview = Interview::findOrFail($id);
        $interview->delete();

        return response()->json(['message' => 'Entrevista eliminada correctamente.']);
    }
}
