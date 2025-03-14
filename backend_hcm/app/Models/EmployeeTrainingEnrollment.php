<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmployeeTrainingEnrollment extends Model
{

    use SoftDeletes;

    protected $casts = [
        'enrollment_date' => 'datetime',

    ];

    protected $fillable = [
        'enrollment_date',
        'score',
        'attendance_rate',
        'assigned_by_admin',
        'completion_status_id',
        'employee_id',
        'training_program_id',
    ];

    public function completion()
    {
        return $this->belongsTo(CompletionStatus::class, 'completion_status_id');
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id')
            ->select('employees.id', 'employees.person_id');
    }

    public function training()
{
    return $this->belongsTo(TrainingProgram::class, 'training_program_id')
        ->select('id', 'name', 'start_date', 'end_date'); // Agregar campos faltantes
}

    public function scopeFilterParticipants($query, array $filters)
    {
        return $query->when(
            $filters['completion_status'] ?? false,
            fn($q, $status) => $q->whereHas(
                'completion',
                fn($q) => $q->where('name', $status)
            )
        )
            ->when(
                $filters['name'] ?? false,
                fn($q, $search) => $q->whereHas(
                    'employee.person',
                    fn($q) => $q->whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$search}%"])
                )
            );
    }
}
