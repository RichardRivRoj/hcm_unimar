<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'person_id',
        'vacancy_id',
        'status_application_id',
    ];

    public function persons()
    {
        return $this->belongsTo(Person::class, 'person_id');
    }

    public function vacanty()
    {
        return $this->belongsTo(Vacancy::class, 'vacancy_id');
    }

    public function status_aplication()
    {
        return $this->belongsTo(StatusApplication::class, 'status_application_id');
    }

    public function agenda()
    {
        return $this->hasMany(Agenda::class, 'candidate_id');
    }
}
