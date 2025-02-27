<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BankEmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $person = $user->persons->with([
            'bankAccounts.accountType',
            'bankAccounts.currency',
            'bankAccounts.status',
            'bankAccounts.bank',
            'identificationType',
            'country'
        ])->first();

        if (!$person) {
            return response()->json(['error' => 'No se encontró información de la persona'], 404);
        }

        $bankAccounts = $person->bankAccounts()
            ->with(['accountType', 'currency', 'status', 'bank'])
            ->paginate(10);

        return response()->json([
            'personal_info' => [
                'full_name' => $person->first_name . ' ' . $person->last_name,
                'identification' => ($person->identificationType ? $person->identificationType->code . ' - ' : '') . $person->identification_value,
                'nationality' => $person->country->name ?? 'No especificado'
            ],
            'bank_accounts' => $bankAccounts->map(function ($account) {
                return [
                    'id' => $account->id,
                    'bank_name' => $account->bank->name ?? 'Banco no especificado',
                    'bank_short_name' => $account->bank->short_name ?? 'Banco no especificado',
                    'account_number' => $account->account_number,
                    'account_type' => $account->accountType->name ?? 'Tipo no definido',
                    'currency' => $account->currency->code ?? 'USD',
                    'status' => $account->status->name ?? 'Sin estado',
                ];
            }),
            'meta' => [
                'current_page' => $bankAccounts->currentPage(),
                'total_pages' => $bankAccounts->lastPage(),
                'total_items' => $bankAccounts->total()
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
        DB::beginTransaction();
        try {
            $user = Auth::user();
            if (!$user) throw new \Exception('Usuario no autenticado', 401);

            $person = $user->persons; // Relación singular
            if (!$person) throw new \Exception('Perfil no encontrado', 404);

            $validator = Validator::make($request->all(), [
                'bank_id' => 'required|exists:banks,id',
                'account_type_id' => 'required|exists:account_types,id',
                'currency_id' => 'required|exists:currencies,id',
                'account_number' => 'required|string|max:50|unique:bank_accounts',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $bankAccount = $person->bankAccounts()->create([
                'bank_id' => $request->bank_id,
                'account_type_id' => $request->account_type_id,
                'currency_id' => $request->currency_id,
                'status_id' => $request->status_id, // Usar valor del request
                'account_number' => $request->account_number
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Cuenta creada',
                'data' => $bankAccount->load(['bank', 'accountType', 'currency', 'status'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => $e->getMessage()
            ], $e->getCode() ?: 500);
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
