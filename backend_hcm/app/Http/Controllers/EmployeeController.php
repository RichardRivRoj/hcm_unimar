<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\EmployeeHiredNotification;
use App\Models\Agenda;
use App\Models\Candidate;
use App\Models\Contract;
use App\Models\ContractTypes;
use App\Models\Employee;
use App\Models\StatusApplication;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class EmployeeController extends Controller
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


    public function store(Request $request, $candidateId)
    {
        // Iniciar una transacción
        DB::beginTransaction();

        try {
            // Validar los datos proporcionados por el administrador
            $validator = Validator::make($request->all(), [
                'start_date' => [
                    'required',
                    'date',
                    function ($attribute, $value, $fail) {
                        $startDate = Carbon::parse($value)->timezone('UTC');
                        if ($startDate->isPast()) {
                            $fail('La fecha de inicio no puede ser anterior a la fecha actual.');
                        }
                    }
                ],
                'end_date' => [
                    'nullable',
                    'date',
                    function ($attribute, $value, $fail) use ($request) {
                        if ($value && Carbon::parse($value)->lte(Carbon::parse($request->start_date))) {
                            $fail('La fecha de fin no puede ser igual o anterior a la fecha de inicio.');
                        }
                    }
                ],
                'payment_term_id' => 'required|exists:payment_terms,id',
                'contract_type_id' => 'required|exists:contract_types,id',
                'employment_type_id' => 'required|exists:employment_types,id',
                'email' => [
                    'required',
                    'email',
                    'unique:users,email',
                    function ($attribute, $value, $fail) {
                        if (User::where('email', $value)->exists()) {
                            $fail('El correo electrónico ya está registrado.');
                        }
                    }
                ],
            ]);

            $validator->sometimes('end_date', 'nullable', function ($input) {
                $indefinido = ContractTypes::where('name', 'like', '%Indefinido%')->first();
                return $input->contract_type_id == $indefinido?->id;
            });

            // Si la validación falla, retornar errores
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Obtener el candidato seleccionado
            $candidate = Candidate::with(['persons', 'vacancy'])->findOrFail($candidateId);
            $vacancy = $candidate->vacancy;

            // Verificar si hay vacantes disponibles
            if ($vacancy->num_vacancy <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No hay vacantes disponibles para esta posición',
                ], 400);
            }

            // Decrementar el número de vacantes
            $vacancy->decrement('num_vacancy');

            // Generar el número de contrato
            $lastContract = Contract::latest()->first(); // Obtener el último contrato creado
            $nextId = $lastContract ? $lastContract->id + 1 : 1; // Incrementar el ID o empezar desde 1
            $contractNumber = 'CON-' . str_pad($nextId, 4, '0', STR_PAD_LEFT); // Formatear a 4 dígitos


            // Crear el empleado
            $employee = Employee::create([
                'person_id' => $candidate->person_id,
            ]);

            // Crear un contrato con los datos proporcionados por el administrador
            Contract::create([
                'contract_number' => $contractNumber,
                'description' => 'Contrato para nuevo empleado',
                'start_date' => $request->start_date,
                'end_date' => $request->end_date ?? null,
                'notes' => 'Contrato generado automáticamente al contratar al candidato.',
                'file_path' => 'Imagen',
                'payment_term_id' => $request->payment_term_id, // Usar valor del request
                'contract_type_id' => $request->contract_type_id,
                'employment_type_id' => $request->employment_type_id,
                'position_id' => $candidate->vacancy->position_id,
                'department_id' => $candidate->vacancy->department_id,
                'employee_id' => $employee->id,
                'status_id' => 1, // Estado por defecto
            ]);



            // Crear un usuario para el empleado
            $password = Str::random(10); // Generar una contraseña aleatoria
            $user = User::create([
                'name' => $candidate->persons->first_name . ' ' . $candidate->persons->last_name,
                'email' => $request->email, // Correo proporcionado por el administrador
                'password' => Hash::make($password),
                'person_id' => $candidate->person_id,
                // department_id no se asigna, ya que es un empleado (no supervisor)
            ]);

            // Asignar el rol "employee" al nuevo usuario
            $user->assignRole('employee');

            // Cambiar el estado de las agendas del candidato a "inactivo"
            Agenda::where('candidate_id', $candidate->id)->update(['status_id' => 2]); // 2 = Inactivo (ajustar según tu sistema)

            // Cambiar estado de la vacante solo si se completaron todas las plazas
            if ($vacancy->num_vacancy === 0) {
                $vacancy->update(['status_id' => 2]); // 2 = Inactivo

                // Rechazar otros candidatos solo cuando se cierra la vacante
                $statusRechazado = StatusApplication::where('name', 'Rechazado')->first();
                Candidate::where('vacancy_id', $vacancy->id)
                    ->where('id', '!=', $candidate->id)
                    ->update(['status_application_id' => $statusRechazado->id]);
            }

            // Cambiar estado del candidato actual a Contratado
            $statusContratado = StatusApplication::where('name', 'Contratado')->first();
            $candidate->update(['status_application_id' => $statusContratado->id]);

            // Enviar un correo electrónico al candidato con sus credenciales
            Mail::to($candidate->persons->email)->send(new EmployeeHiredNotification([
                'name' => $candidate->persons->first_name . ' ' . $candidate->persons->last_name,
                'email' => $request->email,
                'password' => $password,
                'position' => $candidate->vacancy->position->description,
                'department' => $candidate->vacancy->department->name,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ]));

            // Commit de la transacción (guardar todos los cambios)
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Candidato contratado exitosamente.',
                'data' => [
                    'employee' => $employee,
                    'user' => $user,
                ],
            ], 201);
        } catch (\Exception $e) {
            // Rollback de la transacción (deshacer todos los cambios en caso de error)
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al contratar al candidato.',
                'error' => $e->getMessage(),
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
