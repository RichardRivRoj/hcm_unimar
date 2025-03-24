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

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'department_training_program');
    }


    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class, 'department_id');
    }

    public function evaluations()
    {
        return $this->hasMany(PerformanceEvaluation::class, 'department_id');
    }

    public function activeEmployees()
    {
        return $this->hasManyThrough(
            Employee::class,
            Contract::class,
            'department_id', // FK en contracts
            'id', // FK en employees (employee_id)
            'id', // PK en departments
            'employee_id' // FK en contracts (employee_id)
        )->whereHas('contracts', function ($query) {
            $query->active();
        });
    }

    public function scopeWithActiveEmployees($query)
    {
        return $query->whereHas('contracts', function ($q) {
            $q->active()->whereHas('employee', function ($q) {
                $q->active();
            });
        });
    }
}
