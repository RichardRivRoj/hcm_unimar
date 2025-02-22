<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeTrainingEnrollment extends Model
{
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
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function training()
    {
        return $this->belongsTo(TrainingProgram::class, 'training_program_id');
    }
}
