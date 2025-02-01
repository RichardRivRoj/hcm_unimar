<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmploymentTypes extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'short_name', 'description'
    ];

    public function contract()
    {
        return $this->hasMany(Contract::class, 'employment_type_id');
    }
}
