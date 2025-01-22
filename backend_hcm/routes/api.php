<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobPositionController;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\UserController;

Route::middleware(['auth:sanctum'])->get('/user', [UserController::class, 'index']);


// Grupo de rutas para el Administrador (protegidas con autenticación)
Route::middleware(['auth:sanctum'])->group(function () {
    // Rutas para Job Positions (Vacantes)
    Route::prefix('job-positions')->group(function () {
        Route::get('/', [JobPositionController::class, 'index'])->name('api.job_positions.index'); // Listar todas las vacantes
        Route::post('/', [JobPositionController::class, 'store'])->name('api.job_positions.store'); // Crear una vacante
        Route::get('/{id}', [JobPositionController::class, 'show'])->name('api.job_positions.show'); // Ver detalles de una vacante
        Route::put('/{id}', [JobPositionController::class, 'update'])->name('api.job_positions.update'); // Actualizar vacante
        Route::delete('/{id}', [JobPositionController::class, 'destroy'])->name('api.job_positions.destroy'); // Eliminar vacante
    });

    // Rutas para Interviews (Entrevistas)
    Route::prefix('interviews')->group(function () {
        Route::get('/', [InterviewController::class, 'index'])->name('api.interviews.index'); // Listar todas las entrevistas
        Route::post('/', [InterviewController::class, 'store'])->name('api.interviews.store'); // Agendar entrevista
        Route::get('/{id}', [InterviewController::class, 'show'])->name('api.interviews.show'); // Ver detalles de entrevista
        Route::put('/{id}', [InterviewController::class, 'update'])->name('api.interviews.update'); // Actualizar entrevista
        Route::delete('/{id}', [InterviewController::class, 'destroy'])->name('api.interviews.destroy'); // Eliminar entrevista
    });

    // Rutas para Candidates (Candidatos)
    Route::prefix('candidates')->group(function () {
        Route::get('/', [CandidateController::class, 'index'])->name('api.candidates.index'); // Listar todos los candidatos
        Route::get('/{id}', [CandidateController::class, 'show'])->name('api.candidates.show'); // Ver detalles de un candidato
    });

    Route::prefix('departments')->group(function () {
        Route::get('/', [JobPositionController::class, 'getDepartments']);
    });

    // Ruta para obtener los departamentos
    
});

// Grupo de rutas públicas (sin autenticación)
Route::prefix('public')->group(function () {
    // Mostrar vacantes disponibles al público
    Route::get('/job-positions', [JobPositionController::class, 'publicIndex'])->name('api.public.job_positions.index'); // Listar vacantes públicas
    Route::get('/job-positions/{id}', [JobPositionController::class, 'publicShow'])->name('api.public.job_positions.show'); // Ver detalles de una vacante pública

    // Postulación de Candidatos
    Route::post('/candidates', [CandidateController::class, 'store'])->name('api.public.candidates.store'); // Registrar un candidato
});