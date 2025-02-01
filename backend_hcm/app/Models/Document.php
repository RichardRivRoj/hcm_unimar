<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'person_id', 'document_type_id', 'document_name',
        'issue_date', 'expiration_date', 'metadata',
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
}
