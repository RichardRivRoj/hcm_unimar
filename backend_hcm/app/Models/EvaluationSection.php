<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationSection extends Model
{
    protected $fillable = [
        'name',
        'max_score',
        'evaluation_id',
    ];

    public function evaluation()
    {
       return $this->belongsTo(PerformanceEvaluation::class, 'evaluation_id');
    }

    public function questions()
    {
       return $this->hasMany(SectionQuestion::class, 'section_id');
    }
}
