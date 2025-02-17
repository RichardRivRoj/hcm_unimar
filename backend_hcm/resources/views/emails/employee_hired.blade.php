<!DOCTYPE html>
<html>
<head>
    <title>Contratación Exitosa</title>
    <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
    <!-- Contenedor principal -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Encabezado -->
        <tr>
            <td style="background-color: #0052a5; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center;">
                <img src="https://th.bing.com/th/id/OIP.1K-VdFvj6lgInH3jenVVswAAAA?w=119&h=128&c=7&r=0&o=5&dpr=1.5&pid=1.7" alt="Unimar" style="max-width: 200px; height: auto;">
                <h1 style="color: #ffffff; margin-top: 20px; font-size: 24px;">¡Bienvenido a Unimar!</h1>
            </td>
        </tr>

        <!-- Contenido principal -->
        <tr>
            <td style="padding: 30px 20px;">
                <h2 style="color: #333333; font-size: 20px;">Hola {{ $data['name'] }},</h2>
                <p style="color: #333333; font-size: 16px; line-height: 1.6;">
                    Nos complace informarte que has sido contratado en nuestra empresa. A continuación, encontrarás los detalles de tu contratación:
                </p>
                <ul style="color: #333333; padding-left: 20px;">
                    <li><strong>Puesto:</strong> {{ $data['position'] }}</li>
                    <li><strong>Departamento:</strong> {{ $data['department'] }}</li>
                    <li><strong>Fecha de inicio:</strong> {{ $data['start_date'] }}</li>
                    <li><strong>Fecha de finalización:</strong> {{ $data['end_date'] }}</li>
                    <li><strong>Correo electrónico:</strong> {{ $data['email'] }}</li>
                    <li><strong>Contraseña temporal:</strong> {{ $data['password'] }}</li>
                </ul>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <p><strong>Instrucciones importantes:</strong></p>
                    <p>
                        Por favor, cambia tu contraseña después de iniciar sesión por primera vez. 
                        Puedes acceder al sistema utilizando el correo electrónico y la contraseña proporcionados.
                    </p>
                </div>
            </td>
        </tr>

        <!-- Pie de página -->
        <tr>
            <td style="background-color: #f5f7fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                <p style="color: #666666; font-size: 12px; margin: 0;">
                    Equipo de Recursos Humanos - Unimar<br>
                    <a href="[URL_VACANTES]" style="color: #0052a5; text-decoration: none;">Ver otras vacantes disponibles</a><br>
                    <a href="[URL_WEB_OFICIAL]" style="color: #0052a5; text-decoration: none;">www.portalunimar.com</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>