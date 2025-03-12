<?php

use App\Http\Controllers\Admin\AdminRequestController;
use App\Http\Controllers\Admin\EvaluationPeriodController;
use App\Http\Controllers\Admin\FileEmployeeController;
use App\Http\Controllers\Admin\FormEvaluationDepartmentController;
use App\Http\Controllers\Admin\NewTrainingProgramController;
use App\Http\Controllers\AgendaController;
use App\Http\Controllers\AgendaResultController;
use App\Http\Controllers\BankEmployeeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobPositionController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\ContractTypeController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DiplomaController;
use App\Http\Controllers\Employee\EmployeeRequestController;
use App\Http\Controllers\Employee\NewPhotoController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmploymentController;
use App\Http\Controllers\EmploymentTypeController;
use App\Http\Controllers\EthnicityController;
use App\Http\Controllers\GenderController;
use App\Http\Controllers\General\ListDepartmentController;
use App\Http\Controllers\General\ListEmployeeController;
use App\Http\Controllers\General\ListTrainingModalityController;
use App\Http\Controllers\General\ListTrainingTypeController;
use App\Http\Controllers\IdentificationController;
use App\Http\Controllers\IdentificationTypeController;
use App\Http\Controllers\ListAccountTypeController;
use App\Http\Controllers\ListAccountTypeller;
use App\Http\Controllers\ListBanksController;
use App\Http\Controllers\ListCurrencyController;
use App\Http\Controllers\MaritalStatusController;
use App\Http\Controllers\ModalityController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\PublicVacancyController;
use App\Http\Controllers\ReferenceController;
use App\Http\Controllers\ReposeController;
use App\Http\Controllers\RequestTypesController;
use App\Http\Controllers\StatusApplicationController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\StudyController;
use App\Http\Controllers\Supervisor\ClasificationEmployeeController;
use App\Http\Controllers\Supervisor\FormEvaluationController;
use App\Http\Controllers\Supervisor\PerformanceEvaluationController;
use App\Http\Controllers\TypeAgendaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VacantyController;
use App\Models\Employee;
use App\Models\MaritalStatus;
use App\Models\PerformanceEvaluation;
use League\CommonMark\Reference\Reference;

Route::middleware(['auth:sanctum'])->get('/user', [UserController::class, 'index']);

// Ruta para mostrar el formulario de restablecimiento de contraseña
Route::get('password/reset/{token}', [App\Http\Controllers\Auth\ResetPasswordController::class, 'showResetForm'])->name('password.reset');

// Ruta para procesar la actualización de contraseña
Route::post('password/reset', [App\Http\Controllers\Auth\ResetPasswordController::class, 'reset'])->name('password.update');


// Grupo de rutas para el Administrador (protegidas con autenticación)
Route::middleware(['auth:sanctum'])->group(function () {
    // Rutas para Job Positions (Vacantes)

    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('api.notifications.index');
    });
    
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

    Route::prefix('list-banks')->group(function () {
        Route::get('/', [ListBanksController::class, 'index'])->name('api.list-banks.index');
    });

    Route::prefix('list-accounts')->group(function () {
        Route::get('/', [ListAccountTypeController::class, 'index'])->name('api.list-accounts.index');
    });

    Route::prefix('list-currencies')->group(function () {
        Route::get('/', [ListCurrencyController::class, 'index'])->name('api.list-currencies.index');
    });

    Route::prefix('documents')->group(function () {
        Route::get('employments', [EmploymentController::class, 'index']);
        Route::get('employments/{id}', [EmploymentController::class, 'show']);
        Route::post('employments', [EmploymentController::class, 'store']);

        Route::get('studies', [StudyController::class, 'index']);
        Route::post('studies', [StudyController::class, 'store']);

        Route::get('courses', [CourseController::class, 'index']);
        Route::post('courses', [courseController::class, 'store']);

        Route::get('certificates', [CertificateController::class, 'index']);
        Route::post('certificates', [CertificateController::class, 'store']);

        Route::get('diplomas', [DiplomaController::class, 'index']);
        Route::post('diplomas', [DiplomaController::class, 'store']);

        Route::get('identifications', [IdentificationController::class, 'index']);
        Route::post('identifications', [IdentificationController::class, 'store']);

        Route::get('contracts', [ContractController::class, 'index']);

        Route::get('banks', [BankEmployeeController::class, 'index']);
        Route::post('banks', [BankEmployeeController::class, 'store']);

        Route::get('rests', [ReposeController::class, 'index']);

        Route::get('references', [ReferenceController::class, 'index']);
        Route::post('references', [ReferenceController::class, 'store']);
        
        // ... otras rutas de documentos ...
    });

    Route::prefix('list-requests')->group(function () {
        Route::get('/', [RequestTypesController::class, 'index'])->name('api.list-requests.index');
    });
    
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('supervisor')->group(function () {
    
        Route::prefix('departments')->group(function () {
            
            Route::get('employees', [ClasificationEmployeeController::class, 'index'])->name('supervisor.departments.employees.index');
            Route::get('employees/{id}', [ClasificationEmployeeController::class, 'show'])->name('supervisor.departments.employees.show');
        });

        Route::prefix('evaluations')->group(function () {
            Route::get('/evaluation-structure', [PerformanceEvaluationController::class, 'getFullStructure']);
            Route::post('/', [PerformanceEvaluationController::class, 'store'])->name('supervisor.evaluations.store');
            Route::get('/unevaluated-employees', [PerformanceEvaluationController::class, 'unevaluatedEmployees'])->name('supervisor.evaluations.unevaluatedEmployees');
            Route::get('/{employeeId}', [PerformanceEvaluationController::class, 'show'])->name('supervisor.evaluations.show');
            
        });

        Route::prefix('evaluation-forms')->group(function () {
            Route::get('/', [FormEvaluationController::class, 'index']);
            Route::get('/{id}', [FormEvaluationController::class, 'show']);
            
        });
        
    });
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('admin')->group(function () {
    
        Route::prefix('departments')->group(function () {
            
            Route::get('employees', [FileEmployeeController::class, 'index'])->name('admin.departments.employees.index');
            Route::get('employees/{employee}', [FileEmployeeController::class, 'show'])->name('admin.departments.employees.show');
        });

        Route::prefix('requests')->group(function () {
            
            Route::get('/', [AdminRequestController::class, 'index'])->name('admin.requests.index');
            Route::get('/{id}', [AdminRequestController::class, 'show'])->name('admin.requests.show');
            Route::put('/{id}', [AdminRequestController::class, 'update'])->name('admin.requests.update');
        });

        Route::prefix('evaluation-periods')->group(function () {
            
            Route::get('/', [EvaluationPeriodController::class, 'index'])->name('admin.evaluation-period.index');
            Route::post('/', [EvaluationPeriodController::class, 'store'])->name('admin.evaluation-period.store');
            Route::put('/{id}', [EvaluationPeriodController::class, 'update'])->name('admin.evaluation-period.update');
            Route::delete('/{id}', [EvaluationPeriodController::class, 'destroy'])->name('admin.evaluation-period.destroy');
        });

        Route::prefix('evaluation-forms')->group(function () {
            Route::get('/', [FormEvaluationDepartmentController::class, 'index']);
            Route::get('/{id}', [FormEvaluationDepartmentController::class, 'show']);
            
        });

        Route::prefix('training-programs')->group(function () {
            Route::post('/', [NewTrainingProgramController::class, 'store'])->name('training-programs.store');
            Route::get('/', [NewTrainingProgramController::class, 'index'])->name('training-programs.index');
            Route::get('/{id}', [NewTrainingProgramController::class, 'show'])->name('training-programs.show');
        });

        
    });

});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('employee')->group(function () {
    
        Route::prefix('profile')->group(function () {
            Route::post('photo/{id}', [NewPhotoController::class, 'update'])->name('photo.update');
            Route::delete('photo/{id}', [NewPhotoController::class, 'destroy'])->name('photo.destroy');
        });

        Route::prefix('requests')->group(function () {
            Route::get('/', [EmployeeRequestController::class, 'index'])->name('requests.index');
            Route::post('/', [EmployeeRequestController::class, 'store'])->name('requests.store');
            Route::delete('/{id}', [EmployeeRequestController::class, 'destroy'])->name('requests.destroy');
            Route::put('/{id}', [EmployeeRequestController::class, 'update'])->name('requests.update');
            Route::get('/{id}', [EmployeeRequestController::class, 'show'])->name('requests.show');
        });
    });

});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('general')->group(function () {
    
        Route::prefix('list')->group(function () {
            Route::get('/departments', [ListDepartmentController::class, 'index'])->name('list.departments.index');
            Route::get('/employees', [ListEmployeeController::class, 'index'])->name('list.employees.index');
            Route::get('/training-types', [ListTrainingTypeController::class, 'index'])->name('list.training-types.index');
            Route::get('/modalities', [ListTrainingModalityController::class, 'index'])->name('list.training.index');
        });

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