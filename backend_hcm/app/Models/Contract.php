<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $casts = [
        'start_date' => 'datetime:Y-m-d',
        'end_date' => 'datetime:Y-m-d',
    ];

    protected $fillable = [
        'contract_number', 'description',
        'start_date', 'end_date',
        'payment_terms', 'notes',
        'file_path', 'contract_type_id',
        'department_id', 'position_id',
        'employment_type_id', 'status_id',
        'employee_id'
    ];

    public function contractType()
    {
        return $this->belongsTo(ContractTypes::class, 'contract_type_id');
    }

    public function employmentType()
    {
        return $this->belongsTo(EmploymentTypes::class, 'employment_type_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function position()
    {
        return $this->belongsTo(Position::class, 'position_id'); 
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }


    public function scopeActive($query)
    {
        return $query->where('status_id', 1); // Ajusta el ID según tu DB
    }
}
