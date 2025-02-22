<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerformanceEvaluation extends Model
{
    protected $fillable = [
        'total_score',
        'evaluation_status_id',
        'employee_id',
        'department_id',
        'period_id'
    ];


    public function sections()
    {
        return $this->hasMany(EvaluationSection::class, 'evaluation_id');
    }

    public function status()
    {
        return $this->belongsTo(EvaluationStatus::class, 'evaluation_status_id');
    }

    public function period()
    {
        return $this->belongsTo(EvaluationPeriod::class, 'period_id');
    }

    public function response()
    {
        return $this->hasMany(QuestionResponse::class, 'evaluation_id');
    }

}
