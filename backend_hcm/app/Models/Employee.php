<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use PhpParser\Node\Expr\FuncCall;

class Employee extends Model
{
    use HasFactory;

    protected $casts = [
        'start_date'
    ];

    protected $fillable = [
        'person_id',
        'contract_id'
    ];

    public function person()
    {
        return $this->belongsTo(Person::class, 'person_id');
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class, 'employee_id');
    }

    public function requests()
    {
        return $this->hasMany(Request::class, 'employee_id');
    }

    public function trainingEnrollments()
    {
        return $this->hasMany(EmployeeTrainingEnrollment::class, 'employee_id');
    }

    public function evaluations()
    {
        return $this->hasMany(PerformanceEvaluation::class, 'employee_id');
    }

    public function getFullNameAttribute()
    {
        return $this->person->first_name . ' ' . $this->person->last_name;
    }

    public function currentDepartment()
    {
        return $this->hasOneThrough(
            Department::class,
            Contract::class,
            'employee_id',
            'id',
            'id',
            'department_id'
        )->where(function ($query) {
            $query->whereNull('contracts.end_date') // Contratos indefinidos
                ->orWhere('contracts.end_date', '>=', now()); // Contratos con fecha futura
        })->latest('contracts.start_date');
    }

    public function scopeActive($query)
    {
        return $query->whereHas('contracts', function ($q) {
            $q->active();
        });
    }

    public function currentContract()
    {
        return $this->hasOne(Contract::class, 'employee_id')
            ->active()
            ->with(['position:id,description', 'department:id,name'])
            ->latest('start_date');
    }
}
