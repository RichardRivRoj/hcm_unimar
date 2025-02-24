<?php

namespace App\Repositories;

use App\Models\Document;

class DocumentRepository
{
    public function getDocumentsByType($personId, $type, $relations = [])
    {
        return Document::where('person_id', $personId)
            ->ofType($type)
            ->with($relations)
            ->paginate(10);
    }
}