<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DolarController extends Controller
{



    public function getDolarPrice()
    {
        try {
            // Hacer la solicitud a la API del dólar BCV
            $response = Http::get('https://ve.dolarapi.com/v1/dolares/oficial');

            // Verificar si la solicitud fue exitosa
            if ($response->successful()) {
                $data = $response->json();
                return response()->json($data);
            }

            // Si la solicitud falla, devolver un error
            return response()->json([
                'error' => 'No se pudo obtener el precio del dólar'
            ], 500);

        } catch (\Exception $e) {
            // Manejar errores de conexión
            return response()->json([
                'error' => 'Error al conectar con la API del dólar'
            ], 500);
        }
    }

    public function index()
    {
        //
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
