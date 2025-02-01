<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'person_id',
        'vacanty_id',
        'status_id',
    ];

    public function persons()
    {
        return $this->belongsTo(Person::class, 'person_id');
    }

    public function vacanty()
    {
        return $this->belongsTo(Vacanty::class, 'vacanty_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function agenda()
    {
        return $this->hasMany(Agenda::class, 'candidate_id');
    }
}
