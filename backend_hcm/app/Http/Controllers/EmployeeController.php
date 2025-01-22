<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function profile()
    {
        return response()->json(['message' => 'Perfil del empleado']);
    }
}
