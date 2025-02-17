<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmployeeHiredNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->subject('Bienvenido a nuestra empresa')
                    ->view('emails.employee_hired')
                    ->with([
                        'name' => $this->data['name'],
                        'email' => $this->data['email'],
                        'password' => $this->data['password'],
                        'position' => $this->data['position'],
                        'department' => $this->data['department'],
                        'start_date' => $this->data['start_date'],
                        'end_date' => $this->data['end_date'],
                    ]);
    }
}
