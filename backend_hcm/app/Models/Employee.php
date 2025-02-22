<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use PhpParser\Node\Expr\FuncCall;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'person_id', 'position_id', 'department_id',
        'contract_id', 'half',
    ];

    public function persons()
    {
        return $this->belongsTo(Person::class, 'person_id');
    }

    public function position()
    {
        return $this->belongsTo(Position::class, 'position_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function contract()
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }

    public function request()
    {
       return $this->hasMany(Request::class, 'employee_id');
    }
}
