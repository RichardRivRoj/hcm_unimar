<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\User;

class DocumentPolicy
{
    /**
     * Create a new policy instance.
     */
    public function view(User $user, Document $document)
    {
        return $user->person_id === $document->person_id;
    }
}
