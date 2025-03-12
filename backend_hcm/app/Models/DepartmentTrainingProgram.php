<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class DepartmentTrainingProgram extends Pivot
{

    protected $table = 'department_training_program'; // Asegurar nombre correcto

    protected $fillable = [
        'training_program_id',
        'department_id',

    ];

}
