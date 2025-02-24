<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'type' => $this->documenttype->name,
            'name' => $this->document_name,
            'issue_date' => $this->issue_date,
            'expiration_date' => $this->expiration_date,
            'metadata' => $this->metadata,
            'detail' => $this->detail,
            'related_data' => $this->loadRelatedData()
        ];
    }

    protected function loadRelatedData()
    {
        switch ($this->document_type_id) {
            case 4: // Datos Bancarios
                return $this->bankAccount;
            case 2: // Contratos
                return $this->contract;
            default:
                return null;
        }
    }
}
