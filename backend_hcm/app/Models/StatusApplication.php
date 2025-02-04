<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StatusApplication extends Model
{
    protected $fillable = [
        'name', 'short_name'
    ];

    public function candidate() 
    {
        return $this->hasOne(Candidate::class, 'status_application_id');
    }
}
