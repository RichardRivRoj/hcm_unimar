<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    //use HasFactory;

    protected $fillable = [
        'name'
    ];

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
}
