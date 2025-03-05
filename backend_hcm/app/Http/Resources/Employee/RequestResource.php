<?php

namespace App\Http\Resources\Employee;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tipo' => $this->requestType->name,
            'descripcion' => str_limit($this->description, 40),
            'estatus' => $this->requestStatus->name,
            'fecha' => $this->created_at->format('d/m/Y H:i')
        ];
    }
}
