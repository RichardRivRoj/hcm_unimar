<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use League\CommonMark\Node\Block\Document;

class Employee extends Model
{
    use HasFactory;

    // Definir los atributos asignables (mass assignable)
    protected $fillable = ['user_id', 'birth_date', 'phone', 'address'];

    // Relacion con el Modelo User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relacion con EmployeePosition
    public function positions()
    {
        return $this->hasMany(EmployeePosition::class);
    }

    // Relacion con Document
    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
