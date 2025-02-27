<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    protected $fillable = [
        'account_number', 'bank_id', 'account_type_id',
        'currency_id', 'person_id', 'status_id'
    ];

    public function bank()
    {
        return $this->belongsTo(Bank::class, 'bank_id');
    }

    public function accountType()
    {
        return $this->belongsTo(AccountType::class, 'account_type_id');
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class, 'currency_id');
    }

    public function persons()
    {
        return $this->belongsTo(Person::class, 'person_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }
}
