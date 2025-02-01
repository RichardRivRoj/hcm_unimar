<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;

    protected $fillable = [
        'iso', 'name', 'long_name', 'nacionality', 'phone_prefix',
    ];

    public function persons()
    {
        return $this->hasMany(Person::class, 'countries_id');
    }
}
