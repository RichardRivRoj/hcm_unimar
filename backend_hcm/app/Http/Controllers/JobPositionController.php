<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JobPosition;
use App\Models\Department;


class JobPositionController extends Controller
{
    /**
     * Listas todas las ofertas laborales
     */
    public function index()
    {
        $jobPositions = JobPosition::all();
        return response()->json($jobPositions); // Devuelve todas las vacantes en formato JSON
    }

    /**
     * Mostrar el formulario para crear una nueva oferta laboral
     */
    public function getDepartments()
    {
        // Obtiene los departamentos disponibles
        $departments = Department::all(['id', 'name']); // Solo los campos necesarios

        // Retorna los departamentos en formato JSON
        return response()->json($departments);
    }

    /**
     * Guardar una nueva oferta laboral en la BD
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|max:100',
            'description' => 'nullable|string',
            'vacancies' => 'required|integer|min:1',
            'department_id' => 'required|exists:departments,id',
            'location' => 'required|string|max:150',
            'requirements' => 'nullable|string',
            'remote' => 'required|boolean',
        ]);

        $jobPosition = JobPosition::create($validated);

        return response()->json(['message' => 'Oferta laboral creada correctamente', 'jobposition' => $jobPosition], 201);
    }

    /**
     * Mostrar una oferta laboral especifica
     */
    public function show(string $id)
    {
        $jobPosition = JobPosition::findOrFail($id);
        return response()->json($jobPosition);
    }

    /**
     * Mostrar el formulario para editar una oferta laboral
     */
    public function edit(string $id)
    {
        $jobPosition = JobPosition::findOrFail($id);
        return view('job_applications.edit', compact('jobposition'));
    }

    /**
     * Actualizar una oferta laboral especifica
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'title' => 'required|max:100',
            'description' => 'nullable|string',
            'vacancies' => 'required|integer|min:1',
            'department_id' => 'required|exists:departments,id',
            'location' => 'required|string|max:100',
            'requirements' => 'nullable|string',
            'remote' => 'required|boolean',
        ]);

        $jobPosition = JobPosition::findOrFail($id);
        $jobPosition->update($validated);

        return response()->json(['message' => 'Oferta laboral actualizada correctamente.', 'jobposition' => $jobPosition]);
    }

    /**
     * Eliminar una oferta laboral especifica
     */
    public function destroy(string $id)
    {
        $jobPosition = JobPosition::findOrFail($id);
        $jobPosition->delete();

        return response()->json([
            'message' => 'Oferta laboral eliminada correctamente.'
        ]);
    }

    public function publicIndex()
    {
        $vacantes = JobPosition::where('status', 'active')->get(); // Mostrar solo las activas
        return response()->json($vacantes, 200);
    }

    public function publicShow($id)
    {
        $vacante = JobPosition::where('status', 'active')->findOrFail($id); // Buscar vacante activa
        return response()->json($vacante, 200);
    }
}
