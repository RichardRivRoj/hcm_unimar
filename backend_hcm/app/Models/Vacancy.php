<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vacancy extends Model
{
    use HasFactory;

    protected $fillable = [
        'position_id', 'department_id',
        'description', 'requirements', 'responsability', 'num_vacancy',
        'mode_id', 'status_id',
    ];

    public function position()
    {
        return $this->belongsTo(Position::class, 'position_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function mode()
    {
        return $this->belongsTo(Modality::class, 'mode_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function candidate()
    {
        return $this->hasMany(Candidate::class, 'vacancy_id');
    }
}
