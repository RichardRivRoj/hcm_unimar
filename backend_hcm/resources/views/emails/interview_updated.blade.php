<!DOCTYPE html>
<html>
<head>
    <title>Actualización de Evento</title>
    <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
    <!-- Contenedor principal -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Encabezado -->
        <tr>
            <td style="background-color: #0052a5; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center;">
                <img src="https://th.bing.com/th/id/OIP.1K-VdFvj6lgInH3jenVVswAAAA?w=119&h=128&c=7&r=0&o=5&dpr=1.5&pid=1.7" alt="Unimar" style="max-width: 200px; height: auto;">
                <h1 style="color: #ffffff; margin-top: 20px; font-size: 24px;">Actualización de Evento</h1>
            </td>
        </tr>

        <!-- Contenido principal -->
        <tr>
            <td style="padding: 30px 20px;">
                <h2 style="color: #333333; font-size: 20px;">Hola {{ $data['candidate_name'] }},</h2>
                <p style="color: #333333; font-size: 16px; line-height: 1.6;">
                    Te informamos que ha habido cambios en tu evento programado:
                </p>
                <ul style="color: #333333; padding-left: 20px;">
                    <li><strong>Tipo de evento:</strong> {{ $data['type_agenda'] }}</li>
                    <li><strong>Nueva fecha:</strong> {{ $data['scheduled_date'] }}</li>
                    <li><strong>Nueva hora:</strong> {{ $data['time'] }}</li>
                    <li><strong>Ubicación:</strong> {{ $data['location'] }}</li>
                </ul>
                
                @if(!empty($data['changes']))
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <p><strong>Información adicional sobre los cambios:</strong></p>
                    <p>{{ $data['changes'] }}</p>
                </div>
                @endif
            </td>
        </tr>

        <!-- Pie de página -->
        <tr>
            <td style="background-color: #f5f7fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                <p style="color: #666666; font-size: 12px; margin: 0;">
                    Equipo de Reclutamiento - Unimar<br>
                    <a href="[URL_VACANTES]" style="color: #0052a5; text-decoration: none;">Ver otras vacantes disponibles</a><br>
                    <a href="[URL_WEB_OFICIAL]" style="color: #0052a5; text-decoration: none;">www.portalunimar.com</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
