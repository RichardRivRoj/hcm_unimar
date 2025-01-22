<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPosition extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'vacancies',
        'department_id',
        'location',
        'requirements',
        'remote',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }
}
