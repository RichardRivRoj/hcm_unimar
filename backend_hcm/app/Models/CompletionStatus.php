<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompletionStatus extends Model
{
    protected $fillable = [
        'name',
    ];

    // Constantes para los estados
    public const ENROLL = 1; 
    public const EN_PROCESO = 2; 
    public const COMPLETED = 3; 
    public const CANCEL = 4; 

    public function enrollment()
    {
        return $this->hasOne(EmployeeTrainingEnrollment::class, 'completion_status_id');
    }
}
