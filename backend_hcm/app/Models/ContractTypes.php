<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractTypes extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'short_name',
        'description',
    ];

    public function contract()
    {
        return $this->hasOne(Contract::class, 'contract_type_id');
    }
}
