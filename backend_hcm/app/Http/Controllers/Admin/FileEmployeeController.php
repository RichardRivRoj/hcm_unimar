<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\DocumentTypes;
use App\Models\Employee;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FileEmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (!Auth::user()->hasRole('admin')) {
            return response()->json([
                'error' => 'No autorizado',
                'message' => 'Solo los administradores pueden acceder a esta información'
            ], 403);
        }

        $filters = [
            'search' => $request->input('search'),
            'department' => $request->input('department'),
            'status' => $request->input('status'),
            'sort' => $request->input('sort', 'asc'),
            'identification' => $request->input('identification')
        ];

        $query = Employee::with([
            'person.identificationtype',
            'person.user',
            'contracts' => fn($q) => $q->latest()->limit(1)
        ])
            ->withCount(['contracts as active_contracts' => fn($q) => $q->active()]);

        // Aplicar filtros
        if ($filters['search']) {
            $query->whereHas('person', function ($q) use ($filters) {
                $q->where('first_name', 'like', "%{$filters['search']}%")
                    ->orWhere('last_name', 'like', "%{$filters['search']}%");
            });
        }

        if ($filters['identification']) {
            $query->whereHas('person', function ($q) use ($filters) {
                $q->where('identification_value', 'like', "%{$filters['identification']}%");
            });
        }

        if ($filters['department']) {
            $query->whereHas('contracts', function ($q) use ($filters) {
                $q->where('department_id', $filters['department']);
            });
        }
        
        if ($filters['status']) {
            $query->whereHas('contracts', function ($q) use ($filters) {
                $filters['status'] === 'Activo'
                    ? $q->active()
                    : $q->where('status_id', '!=', 1);
            });
        }

        // Ordenación por nombre
        $sortDirection = strtolower($filters['sort']) === 'desc' ? 'desc' : 'asc';
        $query->orderBy(
            Person::select('first_name')
                ->whereColumn('persons.id', 'employees.person_id'),
            $sortDirection
        );

        // Transformación de resultados
        $employees = $query->paginate(10)->through(function ($employee) {
            $latestContract = $employee->contracts->first();
            $currentPosition = $latestContract?->position;
            $currentDepartment = $latestContract?->department;

            return [
                'employee_id' => $employee->id,
                'full_name' => $employee->person->first_name . ' ' . $employee->person->last_name,
                'identification' => [
                    'type' => $employee->person->identificationtype->code,
                    'value' => $employee->person->identification_value
                ],
                'current_position' => $currentPosition->description ?? 'N/A',
                'current_department' => $currentDepartment->name ?? 'N/A',
                'email' => $employee->person->user->email,
                'status' => $employee->active_contracts > 0 ? 'Activo' : 'Inactivo',
                'current_contract' => $latestContract ? [
                    'start_date' => $latestContract->start_date,
                    'end_date' => $latestContract->end_date ?? 'Indefinido'
                ] : null
            ];
        });

        $departments = Department::all(['id', 'name']);

        return response()->json([
            'meta' => [
                'total' => $employees->total(),
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
                'per_page' => $employees->perPage(),
                'filters' => [
                    'available_departments' => $departments->map(function ($dept) {
                        return ['id' => $dept->id, 'name' => $dept->name];
                    })->toArray(), // Convertir a array
                    'status_options' => ['Activo', 'Inactivo']
                ]
            ],
            'data' => $employees->items()
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
    public function show(Employee $employee, Request $request)
    {
        if (!Auth::user()->hasRole('admin')) {
            return response()->json([
                'error' => 'No autorizado',
                'message' => 'Solo los administradores pueden acceder a esta información'
            ], 403);
        }

        // Validar parámetros de entrada
        $validated = $request->validate([
            'category' => 'sometimes|string|in:Contratos,Cuentas de Banco,Identificaciones,Estudios,Certificados,Diplomados,Empleos,Cursos,Reposos,Referencias',
            'page' => 'sometimes|integer|min:1'
        ]);

        // Cargar relaciones principales
        $employee->load([
            'person.documents.documentType',
            'person.user',
        ]);

        $person = $employee->person;

        // Mapeo de tipos de documentos
        $categoryMap = [
            'Identificaciones' => DocumentTypes::firstWhere('name', 'RIF')?->id,
            'Estudios' => DocumentTypes::firstWhere('name', 'Estudios')?->id,
            'Certificados' => DocumentTypes::firstWhere('name', 'Certificados')?->id,
            'Diplomados' => DocumentTypes::firstWhere('name', 'Diplomados')?->id,
            'Empleos' => DocumentTypes::firstWhere('name', 'Empleos')?->id,
            'Cursos' => DocumentTypes::firstWhere('name', 'Cursos')?->id,
            'Reposos' => DocumentTypes::firstWhere('name', 'Reposos')?->id,
            'Referencias' => DocumentTypes::firstWhere('name', 'Referencias')?->id,
        ];

        // Parámetros de paginación
        $category = $request->input('category', 'Contratos');
        $page = $request->input('page', 1);
        $perPage = 10;

        // Verificar configuración del tipo de documento para categorías documentales
        if (!in_array($category, ['Contratos', 'Cuentas de Banco'])) {
            $documentTypeId = $categoryMap[$category] ?? null;
            if (!$documentTypeId) {
                return response()->json([
                    'error' => 'Error de configuración',
                    'message' => 'Contacte al administrador: Tipo de documento no configurado para esta categoría'
                ], 500);
            }
        }

        // Obtener documentos según categoría
        try {
            $documents = match ($category) {
                'Contratos' => $employee->contracts()
                    ->with([
                        'contractType',
                        'employmentType',
                        'position',
                        'department',
                        'status'
                    ])
                    ->latest()
                    ->paginate($perPage, ['*'], 'page', $page),
                'Cuentas de Banco' => $person->bankAccounts()
                    ->with([
                        'bank',
                        'accountType',
                        'currency',
                        'status'
                    ])
                    ->paginate($perPage, ['*'], 'page', $page),
                default => $person->documents()
                    ->where('document_type_id', $categoryMap[$category])
                    ->paginate($perPage, ['*'], 'page', $page)
            };
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al cargar documentos',
                'message' => $e->getMessage()
            ], 500);
        }

        // Transformar datos
        $transformedDocuments = $documents->map(function ($item) use ($category) {
            return $this->transformDocument($item, $category);
        });

        // Datos del empleado
        $employeeData = [
            'id' => $employee->id,
            'nombre_completo' => $person->first_name . ' ' . $person->last_name,
            'identificacion' => [
                'tipo' => $person->identificationType->code,
                'numero' => $person->identification_value
            ],
            'estatus' => $employee->contracts()->active()->exists() ? 'Activo' : 'Inactivo',
            'email' => optional($person->user)->email ?? 'N/A'
        ];

        return response()->json([
            'employee' => $employeeData,
            'documents' => $transformedDocuments,
            'meta' => [
                'current_page' => $documents->currentPage(),
                'last_page' => $documents->lastPage(),
                'per_page' => $documents->perPage(),
                'total' => $documents->total()
            ]
        ]);
    }

    private function transformDocument($document, $category)
    {
        $baseData = [
            'id' => $document->id,
            'nombre' => $document->document_name ?? $document->contract_number,
            'archivo' => $document->file_path,
            'fecha_emision' => $document->issue_date ?? $document->start_date,
            'fecha_expiracion' => $document->expiration_date ?? $document->end_date,
        ];

        $additionalData = match ($category) {
            'Contratos' => [
                'tipo' => optional($document->contractType)->name,
                'departamento' => optional($document->position->department)->name,
                'estatus' => optional($document->status)->name,
                'tipo_empleo' => optional($document->employmentType)->name
            ],
            'Cuentas de Banco' => [
                'banco' => optional($document->bank)->name,
                'numero_cuenta' => $document->account_number,
                'moneda' => optional($document->currency)->code,
                'tipo_cuenta' => optional($document->accountType)->name
            ],
            default => [
                'detalle' => $document->detail,
                'metadatos' => $document->metadata,

            ]
        };

        return array_merge($baseData, $additionalData);
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
