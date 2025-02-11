<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Entrevista Agendada</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        .content {
            margin-top: 20px;
            font-size: 16px;
            color: #555;
        }
        .content p {
            margin: 10px 0;
        }
        .button {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 10px;
            text-align: center;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">¡Evento Agendado!</div>
        <div class="content">
            <p>Hola <strong>{{ $candidate['name'] }}</strong>,</p>
            <p>Tu entrevista ha sido agendada con los siguientes detalles:</p>
            <p><strong>Tipo de Entrevista:</strong> {{ $typeAgenda }}</p>
            <p><strong>Fecha:</strong> {{ $scheduledDate }}</p>
            <p><strong>Hora:</strong> {{ $time }}</p>
            <p><strong>Ubicación:</strong> {{ $location }}</p>
            <p><strong>Próximos pasos:</strong></p>
            <ul>
                <li>Llega 10 minutos antes de la hora programada.</li>
                <li>Trae tu documento de identificación.</li>
                <li>Prepárate para la entrevista.</li>
            </ul>
            <a href="#" class="button">Acceder a la Plataforma</a>
        </div>
        <div class="footer">
            Saludos,<br>
            Equipo de Reclutamiento - Unimar
        </div>
    </div>
</body>
</html>