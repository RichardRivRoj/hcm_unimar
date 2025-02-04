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
        'status_id'
    ];

    public function employee()
    {
        return $this->hasMany(Employee::class, 'department_id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'department_id');
    }

    public function vacanty()
    {
        return $this->hasMany(Vacancy::class, 'department_id');
    }
}
