<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompletionStatus extends Model
{
    protected $fillable = [
        'name',
    ];

    public function enrollment()
    {
        return $this->hasOne(EmployeeTrainingEnrollment::class, 'completion_status_id');
    }
}
