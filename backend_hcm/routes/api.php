<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobPositionController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ModalityController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\PublicVacancyController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VacantyController;

Route::middleware(['auth:sanctum'])->get('/user', [UserController::class, 'index']);


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
        Route::get('/{id}', [CandidateController::class, 'show'])->name('api.candidates.show'); // Ver detalles de un candidato
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

    
    
});

// Grupo de rutas públicas (sin autenticación)
Route::prefix('public')->group(function () {
    // Mostrar vacantes disponibles al público
    Route::get('/vacancies', [PublicVacancyController::class, 'index'])->name('api.public.vacancies.index'); // Listar vacantes públicas
    Route::get('/vacancies/{id}', [PublicVacancyController::class, 'show'])->name('api.public.vacancies.show'); // Ver detalles de una vacante pública

    // Postulación de Candidatos
    Route::post('/candidates', [CandidateController::class, 'store'])->name('api.public.candidates.store'); // Registrar un candidato
});