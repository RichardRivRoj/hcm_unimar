<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IdentificationType extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'name', 'description', 'status',
    ];

    public function persons()
    {
        return $this->hasMany(Person::class, 'identification_type_id');
    }
}
