<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'code',
        'mission',
        'vision',
        'responsibilities',
        'objectives',
        'contact_info',
        'file_path',
        'extra_data',
        'status_id'
    ];

    public function user()
    {
        return $this->hasOne(User::class, 'department_id');
    }

    public function vacanty()
    {
        return $this->hasMany(Vacancy::class, 'department_id');
    }

    public function program()
    {
        return $this->hasOne(TrainingProgram::class, 'department_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class, 'department_id');
    }
}
