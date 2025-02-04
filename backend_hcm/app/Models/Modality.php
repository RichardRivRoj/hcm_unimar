<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modality extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description'
    ];

    public function vacanty()
    {
        return $this->hasOne(Vacanty::class, 'mode_id');
    }
}
