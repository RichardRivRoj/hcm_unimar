<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Candidate;

class CandidateController extends Controller
{
    /**
     * Listar todos los candidatos registrados.
     */
    public function index(Request $request)
    {
        // Filtro por vacante si se proporciona
        $query = Candidate::query();

        if ($request->has('job_position_id')) {
            $query->where('job_position_id', $request->job_position_id);
        }

        $candidates = $query->with('jobPosition')->get();

        return response()->json($candidates, 200);
    }

    /**
     * Guardar los datos de un nuevo candidato.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:candidates,email',
            'phone' => 'required|string|max:15',
            'cv_path' => 'required|file|mimes:pdf,jpg,png|max:2048',
            'job_position_id' => 'required|exists:job_positions,id',
        ]);

        // Manejo del archivo del CV
        $cvPath = $request->file('cv_path')->store('cvs', 'public'); // Guardar el CV en el sistema

        $candidate = Candidate::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'cv_path' => $cvPath,
            'job_position_id' => $validated['job_position_id'],
        ]);

        return response()->json(['message' => 'Postuacion realizada con exito', 'candidate' => $candidate], 201);
    }

    /**
     * Mostrar un candidato específico.
     */
    public function show($id)
    {
        $candidate = Candidate::with('jobPosition')->findOrFail($id);

        return response()->json($candidate, 200);
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
}
