<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_id', 'type_agenda_id',
        'scheduled_date', 'time',
        'location', 'status_id',
    ];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class, 'candidate_id');
    }

    public function typeagenda()
    {
        return $this->belongsTo(TypeAgenda::class, 'type_agenda_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function agendaresult()
    {
        return $this->hasOne(AgendaResult::class, 'agenda_id');
    }
}
