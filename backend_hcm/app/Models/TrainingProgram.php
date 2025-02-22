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
        'department_id'
    ];

    public function enrollment()
    {
        return $this->hasMany(EmployeeTrainingEnrollment::class, 'training_program_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
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
}
