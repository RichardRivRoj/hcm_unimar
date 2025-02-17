<?php

use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use App\Mail\ApplicationAccepted;
use App\Mail\ApplicationRejected;
use App\Mail\EmployeeHiredNotification;
use App\Mail\InterviewScheduled;
use App\Mail\InterviewUpdated;

Route::get('/', function () {
    $mailData = [
        'name' => 'María González',
        'email' => 'example@unimar.edu.ve',
        'password' => 'password123',
        'position' => '10:00',
        'department' => 'Sala 2',
        'start_date' => '20-02-2025',
        'end_date' => '20-05-2025'
    ];
    
    return new EmployeeHiredNotification($mailData);
});

Route::get('/photos/{filename}', function ($filename) {
    $path = storage_path('app/private/public/photos/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    $file = file_get_contents($path);
    $type = mime_content_type($path);

    return Response::make($file, 200)->header('Content-Type', $type);
})->name('photo.show');



require __DIR__.'/auth.php';
