<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingModality extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function programs()
    {
        return $this->hasMany(TrainingProgram::class, 'modality_id');
    }
}
