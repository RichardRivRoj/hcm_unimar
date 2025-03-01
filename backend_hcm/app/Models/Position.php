<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'code',
        'level_id',
        'status_id',
    ];

    public function level()
    {
        return $this->belongsTo(Level::class, 'level_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function vacanty()
    {
        return $this->hasMany(Vacancy::class, 'position_id');
    }

    public function contract()
    {
        return $this->hasOne(Contract::class, 'position_id');
    }

    // En el modelo Position
    public function salaries() // Relación faltante
    {
        return $this->hasManyThrough(
            Salary::class,
            Level::class,
            'id', // Foreign key en la tabla levels
            'level_id', // Foreign key en la tabla salaries
            'level_id', // Local key en la tabla positions
            'id' // Local key en la tabla levels
        );
    }
}
