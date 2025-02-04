<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVacancyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'position_id' => 'required|exists:positions,id',
            'department_id' => 'required|exists:departments,id',
            'title' => 'required|string|max:100',
            'description' => 'required|string',
            'requirements' => 'required|json',
            'num_vacancy' => 'required|integer|min:1',
            'mode_id' => 'required|exists:modalities,id',
            'status_id' => 'required|exists:statuses,id'
        ];
    }
}
