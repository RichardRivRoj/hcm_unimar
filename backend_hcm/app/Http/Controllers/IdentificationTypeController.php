<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\IdentificationType;
use Illuminate\Http\Request;

class IdentificationTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtiene los tipos de identificaciones disponibles
        $identifications = IdentificationType::all(['id', 'code', 'name']); // Solo los campos necesarios

        // Retorna los tipos de identificaciones en formato JSON
        return response()->json($identifications);
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
