<?php

use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use App\Mail\ApplicationAccepted;
use App\Mail\ApplicationRejected;
use App\Mail\InterviewScheduled;

Route::get('/', function () {
    $mailData = [
        'candidate' => 'María González',
        'typeAgenda' => 'Backend',
        'scheduledDate' => '20-10-2000',
        'time' => '10:00',
        'location' => 'Sala 2'
    ];
    
    return new InterviewScheduled($mailData);
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
