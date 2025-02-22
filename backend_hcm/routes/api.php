<?php

use App\Http\Controllers\AgendaController;
use App\Http\Controllers\AgendaResultController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobPositionController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\ContractTypeController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmploymentTypeController;
use App\Http\Controllers\EthnicityController;
use App\Http\Controllers\GenderController;
use App\Http\Controllers\IdentificationTypeController;
use App\Http\Controllers\MaritalStatusController;
use App\Http\Controllers\ModalityController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\PublicVacancyController;
use App\Http\Controllers\StatusApplicationController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\TypeAgendaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VacantyController;
use App\Models\MaritalStatus;

Route::middleware(['auth:sanctum'])->get('/user', [UserController::class, 'index']);

// Ruta para mostrar el formulario de restablecimiento de contraseña
Route::get('password/reset/{token}', [App\Http\Controllers\Auth\ResetPasswordController::class, 'showResetForm'])->name('password.reset');

// Ruta para procesar la actualización de contraseña
Route::post('password/reset', [App\Http\Controllers\Auth\ResetPasswordController::class, 'reset'])->name('password.update');


// Grupo de rutas para el Administrador (protegidas con autenticación)
Route::middleware(['auth:sanctum'])->group(function () {
    // Rutas para Job Positions (Vacantes)
    Route::prefix('vacancies')->group(function () {
        Route::get('/', [VacantyController::class, 'index'])->name('api.vacancies.index'); // Listar todas las vacantes
        Route::post('/', [VacantyController::class, 'store'])->name('api.vacancies.store'); // Crear una vacante
        Route::get('/{id}', [VacantyController::class, 'show'])->name('api.vacancies.show'); // Ver detalles de una vacante
        Route::put('/{id}', [VacantyController::class, 'update'])->name('api.vacancies.update'); // Actualizar detalles de una vacante
        Route::delete('/{id}', [VacantyController::class, 'destroy'])->name('api.vacancies.destroy'); // Eliminar vacante
    });

    // Rutas para Interviews (Entrevistas)

    // Rutas para Candidates (Candidatos)
    Route::prefix('candidates')->group(function () {
        Route::get('/', [CandidateController::class, 'index'])->name('api.candidates.index'); // Listar todos los candidatos
        Route::get('/{candidateId}', [CandidateController::class, 'show'])->name('api.candidates.show'); // Ver detalles de un candidato
        Route::put('/{id}/status', [CandidateController::class, 'updateStatus'])->name('api.candidates.status.update');
        Route::get('/{candidate_id}/agendas', [AgendaController::class, 'index'])->name('api.candidates.agendas.index');
        
    });

    // Rutas para Candidates (Candidatos)
    Route::prefix('agendas')->group(function () {
        Route::post('/', [AgendaController::class, 'store'])->name('api.agendas.store'); // Crear nuevo evento
        Route::get('/{id}', [AgendaController::class, 'show'])->name('api.agendas.show'); // Ver evento especifico
        Route::put('/{id}', [AgendaController::class, 'update'])->name('api.agendas.update'); // actualizar agenda 
        Route::delete('/{id}', [AgendaController::class, 'destroy'])->name('api.agendas.destroy'); // Eliminar agenda 
    });

    Route::prefix('agenda-results')->group(function () {
        Route::get('/', [AgendaResultController::class, 'index'])->name('api.agenda-results.index');
        Route::post('/', [AgendaResultController::class, 'store'])->name('api.agenda-results.store');
        Route::get('/{id}', [AgendaResultController::class, 'show'])->name('api.agenda-results.show');
        Route::delete('/{id}', [AgendaResultController::class, 'destroy'])->name('api.agenda-results.destroy'); 
    });

    Route::prefix('employees')->group(function () {
        Route::post('/{candidateId}', [EmployeeController::class, 'store'])->name('api.employees.store');
    });
    


    Route::prefix('departments')->group(function () {
        Route::get('/', [DepartmentController::class, 'index'])->name('api.departments.index');
    });

    // Ruta para obtener los departamentos
    Route::prefix('positions')->group(function () {
        Route::get('/', [PositionController::class, 'index'])->name('api.positions.index');
    });

    Route::prefix('modalities')->group(function () {
        Route::get('/', [ModalityController::class, 'index'])->name('api.madalities.index');
    });

    Route::prefix('statuses')->group(function () {
        Route::get('/', [StatusController::class, 'index'])->name('api.statuses.index');
    });

    Route::prefix('applications')->group(function () {
        Route::get('/', [StatusApplicationController::class, 'index'])->name('api.applications.index');
    });

    Route::prefix('type_agendas')->group(function () {
        Route::get('/', [TypeAgendaController::class, 'index'])->name('api.type_agendas.index');
    });
    
    Route::prefix('employment_types')->group(function () {
        Route::get('/', [EmploymentTypeController::class, 'index'])->name('api.employment_types.index');
    });

    Route::prefix('contract_types')->group(function () {
        Route::get('/', [ContractTypeController::class, 'index'])->name('api.contract_types.index');
    });
    
});

// Grupo de rutas públicas (sin autenticación)
Route::prefix('public')->group(function () {
    // Mostrar vacantes disponibles al público
    Route::get('/vacancies', [PublicVacancyController::class, 'index'])->name('api.public.vacancies.index'); // Listar vacantes públicas
    Route::get('/vacancies/{id}', [PublicVacancyController::class, 'show'])->name('api.public.vacancies.show'); // Ver detalles de una vacante pública

    // Postulación de Candidatos
    Route::post('/candidates/{vacancyId}', [CandidateController::class, 'store'])->name('api.public.candidates.store');

    // Tipos de identificaciones
    Route::get('/identifications', [IdentificationTypeController::class, 'index'])->name('api.public.identifications.index'); // Listar identifications

    // Tipos de generos
    Route::get('/genders', [GenderController::class, 'index'])->name('api.public.genders.index'); // Listar generos

    // Tipos de etnias
    Route::get('/ethnicities', [EthnicityController::class, 'index'])->name('api.public.ethnicities.index'); // Listar etnias

    // Tipos de estados civiles
    Route::get('/maritalstatuses', [MaritalStatusController::class, 'index'])->name('api.public.maritalstatuses.index'); // Listar estados civiles

    // Tipos de paises
    Route::get('/countries', [CountryController::class, 'index'])->name('api.public.countries.index'); // Listar paises
    
});