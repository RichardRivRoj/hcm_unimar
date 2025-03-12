<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingProgram extends Model
{
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
}
