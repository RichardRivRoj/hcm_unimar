<?php

namespace App\Services;

use App\Repositories\DocumentRepository;

class DocumentService
{
    protected $repository;

    public function __construct(DocumentRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getEmployeeDocuments($personId, $type)
    {
        return $this->repository->getDocumentsByType(
            $personId,
            $type,
            ['documenttype', 'bankAccount', 'contract']
        );
    }
}