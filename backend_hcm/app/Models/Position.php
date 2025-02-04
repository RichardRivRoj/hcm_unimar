<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasFactory;

    protected $fillable = [
        'description', 'code',
        'level_id', 'status_id',
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
}
