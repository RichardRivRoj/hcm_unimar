<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class NewPhotoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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
        // Verificar autenticación
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        // Obtener la persona
        $person = Person::findOrFail($id);

        // Verificar permisos
        if ($user->person_id != $person->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        DB::beginTransaction();
        try {

            $validator = Validator::make($request->all(), [
                'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Eliminar foto anterior
            if ($person->file_path) {
                $oldPhotoPath = str_replace('/storage', 'public', $person->file_path);
                Storage::disk('public')->delete($oldPhotoPath);
            }

            // Almacenar nueva foto
            $photoPath = $request->file('photo')->store('public/photos');
            $photoUrl = Storage::url($photoPath);

            // Actualizar base de datos usando el estilo indicado
            $person->update([
                'file_path' => $photoUrl
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Foto actualizada correctamente',
                'photo_url' => $photoUrl
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error actualizando foto: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error interno al actualizar',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        // Verificar autenticación
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        // Obtener la persona
        $person = Person::findOrFail($id);

        // Verificar que el usuario autenticado solo elimine su propio perfil
        if ($user->person_id != $person->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        DB::beginTransaction();
        try {
            // Eliminar archivo físico si existe
            if ($person->file_path) {
                $oldPhotoPath = str_replace('/storage', 'public', $person->file_path);
                Storage::delete($oldPhotoPath);
            }

            // Actualizar base de datos
            $person->file_path = null;
            $person->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Foto de perfil eliminada correctamente',
                'photo_url' => null
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error eliminando foto: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la foto',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
