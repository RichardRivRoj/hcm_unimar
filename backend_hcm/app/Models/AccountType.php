<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountType extends Model
{
    protected $fillable = [
        'name'
    ];

    public function bank_account()
    {
        return $this->hasOne(BankAccount::class, 'account_type_id');
    }
}
