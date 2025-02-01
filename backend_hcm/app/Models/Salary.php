<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salary extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount', 'amount_letters', 'valid_from',
        'valid_to', 'currency_id', 'level_id',
        'status_id',
    ];

    public function currency()
    {
        return $this->belongsTo(Currency::class, 'currency_id');
    }

    public function level()
    {
        return $this->belongsTo(Level::class, 'level_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }
}
