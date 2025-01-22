<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_id',
        'job_position_id',
        'status',
    ];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function jobposition()
    {
        return $this->belongsTo(JobPosition::class);
    }

    public function interviews()
    {
        return $this->hasMany(Interview::class);
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }
}
