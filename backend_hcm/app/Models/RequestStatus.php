<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestStatus extends Model
{
    protected $fillable = [
        'name', 
    ];

    public function request()
    {
        return $this->hasOne(Request::class, 'request_status_id');
    }
}
