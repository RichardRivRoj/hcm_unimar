<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function position()
    {
        return $this->hasMany(Position::class, 'level_id');
    }

    public function salary()
    {
        return $this->hasMany(Salary::class, 'level_id');
    }
}
