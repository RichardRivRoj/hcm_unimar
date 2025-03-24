<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentTerm extends Model
{
    protected $fillable = [
        'name', 'description',
        'reference'
    ];

    public function contract()
    {
        return $this->hasOne(Contract::class, 'payment_term_id');
    }

}
