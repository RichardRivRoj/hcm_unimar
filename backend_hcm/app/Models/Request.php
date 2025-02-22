<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    protected $fillable = [
        'employee_id',
        'request_type_id',
        'request_status_id',
        'description',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function requestType()
    {
        return $this->belongsTo(RequestType::class, 'request_type_id');
    }

    public function requestStatus()
    {
        return $this->belongsTo(RequestStatus::class, 'request_status_id');
    }
}
