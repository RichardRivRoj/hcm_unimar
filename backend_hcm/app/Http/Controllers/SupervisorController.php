<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SupervisorController extends Controller
{
    public function manageRecruitment()
    {
        return response()->json(['message' => 'Gestion de reclutamiento']);
    }
}
