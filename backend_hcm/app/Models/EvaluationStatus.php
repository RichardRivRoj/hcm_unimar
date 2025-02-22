<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationStatus extends Model
{
    protected $fillable = [
        'name'
    ];

    public function evaluation()
    {
       return $this->hasOne(PerformanceEvaluation::class, 'evaluation_status_id');
    }
}
