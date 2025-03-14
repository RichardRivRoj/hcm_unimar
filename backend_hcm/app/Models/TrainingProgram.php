<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingProgram extends Model
{

    protected $casts = [
        'start_date' => 'datetime:Y-m-d',
        'end_date' => 'datetime:Y-m-d',
    ];

    protected $fillable = [
        'name',
        'description',
        'content',
        'start_date',
        'end_date',
        'limit',
        'visibility_id',
        'status_id',
        'training_type_id',
        'modality_id',
    ];

    public function enrollment()
    {
        return $this->hasMany(EmployeeTrainingEnrollment::class, 'training_program_id');
    }

    public function departments()
    {
        return $this->belongsToMany(
            Department::class,
            'department_training_program',
            'training_program_id',
            'department_id'
        )->using(DepartmentTrainingProgram::class);
    }



    public function modality()
    {
        return $this->belongsTo(TrainingModality::class, 'modality_id');
    }

    public function trainingType()
    {
        return $this->belongsTo(TrainingType::class, 'training_type_id');
    }

    public function visibility()
    {
        return $this->belongsTo(ProgramVisibility::class, 'visibility_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function scopeFilter($query, $filters)
    {
        return $query->when(isset($filters['training_type_id']), function ($q) use ($filters) {
            $q->where('training_type_id', $filters['training_type_id']);
        })
            ->when(isset($filters['modality_id']), function ($q) use ($filters) {
                $q->where('modality_id', $filters['modality_id']);
            })
            ->when(isset($filters['visibility_id']), function ($q) use ($filters) {
                $q->where('visibility_id', $filters['visibility_id']);
            })
            ->when(isset($filters['status_id']), function ($q) use ($filters) {
                $q->where('status_id', $filters['status_id']);
            })
            ->when(isset($filters['name']), function ($q) use ($filters) {
                $q->where('name', 'LIKE', '%' . $filters['name'] . '%');
            });
    }

    public function scopeFilterByRequest($query, $request)
    {
        return $query->when($request->filled('month'), function ($q) use ($request) {
                $q->whereMonth('start_date', $request->month);
            })
            ->when($request->filled('year'), function ($q) use ($request) {
                $q->whereYear('start_date', $request->year);
            })
            ->when($request->filled('training_type_id'), function ($q) use ($request) {
                $q->where('training_type_id', $request->training_type_id);
            });
    }

    public function employees()
    {
        return $this->belongsToMany(
            Employee::class,
            'employee_training_enrollments',
            'training_program_id',
            'employee_id'
        )->select(
            'employees.id', 
            'employees.person_id', 
            'employee_training_enrollments.enrollment_date'
        );
    }
}
