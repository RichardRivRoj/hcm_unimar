<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    use HasFactory;

    protected $table = 'persons';

    protected $fillable = [
        'first_name', 'last_name', 'email',
        'birth_date', 'phone', 'file_path', 'summary',
        'identification_value','identification_type_id', 
        'ethnicity_id', 'marital_status_id',
        'gender_id', 'countries_id', 'status_id',
    ];

    public function identificationtype()
    {
        return $this->belongsTo(IdentificationType::class, 'identification_type_id');
    }

    public function ethnicity()
    {
        return $this->belongsTo(Ethnicity::class, 'ethnicity_id');
    }

    public function gender()
    {
        return $this->belongsTo(Gender::class, 'gender_id');
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'countries_id');
    }

    public function maritalstatus()
    {
        return $this->belongsTo(MaritalStatus::class, 'marital_status_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'person_id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'person_id');
    }

    public function employee()
    {
        return $this->hasMany(Employee::class, 'person_id');
    }

    public function candidate()
    {
        return $this->hasOne(Candidate::class, 'person_id');
    }

    public function bank_account()
    {
        return $this->hasMany(BankAccount::class, 'person_id');
    }
}
