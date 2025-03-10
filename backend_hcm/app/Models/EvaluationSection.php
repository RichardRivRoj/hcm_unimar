<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationSection extends Model
{
    protected $fillable = [
        'name',
        'max_score',
    ];


    public function questions()
    {
       return $this->hasMany(SectionQuestion::class, 'section_id');
    }
}
