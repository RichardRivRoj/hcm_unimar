<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $casts = [
        'metadata' => 'array'
    ];

    protected $fillable = [
        'person_id', 'document_type_id', 'document_name',
        'issue_date', 'expiration_date', 'detail' , 'metadata',
        'file_path', 'status',
    ];

    public function persons()
    {
        return $this->belongsTo(Person::class, 'person_id');
    }

    public function documenttype()
    {
        return $this->belongsTo(DocumentTypes::class, 'document_type_id');
    }

    public function scopeOfType(Builder $query, $type)
    {
        return $query->where('document_type_id', $type);
    }
    
    public function bankAccount()
    {
        return $this->hasOne(BankAccount::class);
    }
    
    public function contract()
    {
        return $this->hasOne(Contract::class);
    }
}
