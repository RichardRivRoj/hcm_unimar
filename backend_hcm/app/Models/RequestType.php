<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestType extends Model
{
    protected $fillable = [
        'name', 'description'
    ];

    public function request()
    {
       return $this->hasOne(Request::class, 'request_type_id');
    }
}
