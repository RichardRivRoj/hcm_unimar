<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ethnicity extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'short_name',
    ];

    public function persons()
    {
        return $this->hasMany(Person::class, 'ethnicity_id');
    }
}
