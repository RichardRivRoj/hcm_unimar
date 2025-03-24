<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    //use HasFactory;

    protected $fillable = [
        'name'
    ];

    // Constantes para los estados
    public const ACTIVE = 1; // ID del estado "Activo"
    public const INACTIVE = 2; // ID del estado "Inactivo"

    public function persons()
    {
        return $this->hasOne(Person::class, 'status_id');
    }

    public function position()
    {
        return $this->hasOne(Position::class, 'status_id');
    }

    public function salary()
    {
        return $this->hasOne(Salary::class, 'status_id');
    }

    public function contract()
    {
        return $this->hasOne(Contract::class, 'status_id');
    }

    public function vacanty()
    {
        return $this->hasOne(Vacancy::class, 'status_id');
    }

    public function candidate()
    {
        return $this->hasOne(Candidate::class, 'status_id');
    }


    public function bank_account()
    {
        return $this->hasOne(BankAccount::class, 'status_id');
    }

    public function period()
    {
       return $this->hasOne(EvaluationPeriod::class, 'status_id');
    }

    public function training()
    {
       return $this->hasOne(TrainingProgram::class, 'status_id');
    }
}
