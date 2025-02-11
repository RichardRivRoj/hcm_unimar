<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'short_name',
    ];

    public function salary()
    {
        return $this->hasMany(Salary::class, 'currency_id');
    }

    public function bank_account()
    {
        return $this->hasMany(BankAccount::class, 'currency_id');
    }
}
