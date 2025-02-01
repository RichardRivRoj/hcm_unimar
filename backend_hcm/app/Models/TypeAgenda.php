<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeAgenda extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function agenda()
    {
        return $this->hasOne(Agenda::class, 'type_agenda_id');
    }
}
