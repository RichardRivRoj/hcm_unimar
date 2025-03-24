<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Vacancy extends Model
{
    use HasFactory;

    protected $fillable = [
        'position_id',
        'department_id',
        'description',
        'requirements',
        'responsability',
        'num_vacancy',
        'mode_id',
        'status_id',
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

    /**
     * Scope para unir con candidatos (LEFT JOIN)
     */
    public function scopeLeftJoinRelatedCandidates($query)
    {
        return $query->leftJoin('candidates', 'vacancies.id', '=', 'candidates.vacancy_id');
    }

    /**
     * Scope para unir con agendas (LEFT JOIN)
     */
    public function scopeLeftJoinRelatedAgendas($query)
    {
        return $query->leftJoin('agendas', 'candidates.id', '=', 'agendas.candidate_id');
    }

    /**
     * Scope para unir tablas relacionadas (INNER JOIN)
     */
    public function scopeJoinRelatedTables($query)
    {
        return $query
            ->join('candidates', 'vacancies.id', '=', 'candidates.vacancy_id')
            ->join('employees', 'candidates.person_id', '=', 'employees.person_id')
            ->join('contracts', 'employees.id', '=', 'contracts.employee_id')
            ->join('departments', 'vacancies.department_id', '=', 'departments.id');
    }

    // Scope limitTopDepartments corregido
    public function scopeLimitTopDepartments($query, $limit = 5)
    {
        if ($limit !== null) {
            return $query
                ->orderByDesc(DB::raw('AVG(DATEDIFF(contracts.start_date, vacancies.created_at)'))
                ->limit($limit);
        }
        return $query;
    }
}
