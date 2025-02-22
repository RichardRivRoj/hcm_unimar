<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SectionQuestion extends Model
{
    protected $fillable = [
        'question_text',
        'max_score',
        'section_id',
    ];

    public function sections()
    {
        return $this->belongsTo(EvaluationSection::class, 'section_id');
    }

    public function response()
    {
        return $this->hasMany(QuestionResponse::class, 'question_id');
    }
}
