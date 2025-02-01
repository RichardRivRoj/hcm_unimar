<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_number', 'description',
        'star_date', 'end_date',
        'payment_terms', 'notes',
        'file_path', 'contract_type_id',
        'employment_type_id', 'status_id',
    ];

    public function contracttype()
    {
        return $this->belongsTo(ContractTypes::class, 'contract_type_id');
    }

    public function employmenttype()
    {
        return $this->belongsTo(EmploymentTypes::class, 'employment_type_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }
}
