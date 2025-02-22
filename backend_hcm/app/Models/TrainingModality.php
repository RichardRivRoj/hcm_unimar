<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingModality extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function program()
    {
        return $this->hasOne(TrainingProgram::class, 'modality_id');
    }
}
