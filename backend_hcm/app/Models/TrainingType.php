<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingType extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function programs()
    {
        return $this->hasMany(TrainingProgram::class, 'training_type_id');
    }
}
