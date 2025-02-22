<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramVisibility extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function program()
    {
        return $this->hasOne(TrainingProgram::class, 'visibility_id');
    }
}
