<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListEmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $employees = Employee::with(['person' => function($query) {
                    $query->select(['id', 'first_name', 'last_name', 'email']);
                }])
                ->active()
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function($employee) {
                    return [
                        'id' => $employee->id,
                        'full_name' => $employee->person->first_name . ' ' . $employee->person->last_name,
                        'email' => $employee->person->email,
                        'current_department' => $employee->currentDepartment->name ?? 'Sin departamento'
                    ];
                });

            return response()->json($employees);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener empleados: ' . $e->getMessage()
            ], 500);
        }
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
