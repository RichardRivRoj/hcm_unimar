<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationPeriod extends Model
{

    protected $dates = ['start_date', 'end_date']; 

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'status_id',
    ];

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function evaluation()
    {
        return $this->hasOne(PerformanceEvaluation::class, 'period_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status_id', Status::where('name', 'Activo')->first()->id);
    }
}
