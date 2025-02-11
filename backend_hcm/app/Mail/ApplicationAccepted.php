<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ApplicationAccepted extends Mailable
{
    use Queueable, SerializesModels;

    public $mailData;

    public function __construct(array $mailData)
    {
        $this->mailData = $mailData;
    }

    public function build()
    {
        return $this->subject('Postulación Aceptada')
            ->view('emails.application-accepted')
            ->with([
                'name' => $this->mailData['name'],
                'puesto' => $this->mailData['puesto']
            ]);
    }
}