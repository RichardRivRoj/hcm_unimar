<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEvaluationPeriodRequest extends FormRequest
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
       // Acceder al período desde el request
       $period = $this->input('period');

       return [
           'name' => 'nullable|max:255|unique:evaluation_periods,name,' . ($period ? $period->id : 'NULL'),
           'start_date' => 'required|date',
           'end_date' => 'required|date|after:start_date',
       ];
   }

   public function messages()
   {
       return [
           'start_date.required' => 'La fecha de inicio es requerida',
           'end_date.after' => 'La fecha final debe ser posterior a la inicial',
           'status_id.exists' => 'El estado seleccionado no es válido'
       ];
   }
}