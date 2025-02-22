<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionResponse extends Model
{
    protected $fillable = [
        'score',
        'comments',
        'evaluation_id',
        'question_id'
    ];

    public function evaluation()
    {
        return $this->belongsTo(PerformanceEvaluation::class, 'evaluation_id');
    }

    public function question()
    {
        return $this->belongsTo(SectionQuestion::class, 'question_id');
    }
}
