<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use PhpParser\Node\Expr\FuncCall;

class MaritalStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'short_name',
    ];

    public function persons()
    {
        return $this->hasMany(Person::class, 'marital_status_id');
    }
}
