<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bank extends Model
{
    protected $fillable = [
        'name',
        'short_name',
        'code'
    ];

    public function bank_account()
    {
        return $this->hasMany(BankAccount::class, 'bank_id');
    }
}
