<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreEvaluationPeriodRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return $this->user() && $this->user()->hasRole('admin');
    }

    public function rules()
    {
        return [
            'name' => 'required|max:255',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
        ];
    }

    public function messages()
    {
        return [
            'start_date.after_or_equal' => 'La fecha de inicio no puede ser en el pasado',
            'end_date.after' => 'La fecha de fin debe ser posterior a la fecha de inicio'
        ];
    }
}
