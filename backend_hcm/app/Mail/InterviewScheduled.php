<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Agenda;

class InterviewScheduled extends Mailable
{
    use Queueable, SerializesModels;

    public $agendaData;

    public function __construct(array $agendaData)
    {
        $this->agendaData = $agendaData;
    }

    public function build()
    {
        return $this->subject('Cita programada')
            ->view('emails.interview-scheduled')
            ->with([
                'candidate' => $this->agendaData['candidate'],
                'typeAgenda' => $this->agendaData['typeAgenda'],
                'scheduledDate' => $this->agendaData['scheduledDate'],
                'time' => $this->agendaData['time'],
                'location' => $this->agendaData['location']
            ]);
    }
}
