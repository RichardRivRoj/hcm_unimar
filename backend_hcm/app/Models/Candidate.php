<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'cv_path',
    ];

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function jobPosition()
    {
        return $this->belongsTo(JobPosition::class, 'job_position_id');
    }
}
