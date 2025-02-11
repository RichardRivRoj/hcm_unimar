<!DOCTYPE html>
<html>
<head>
    <title>Aplicación Aceptada - UNIMAR</title>
    <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
    <!-- Contenedor principal -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Encabezado -->
        <tr>
            <td style="background-color: #0052a5; padding: 30px 20px; border-radius: 8px 8px 0 0;">
                <table width="100%">
                    <tr>
                        <td style="text-align: center;">
                            <img src="https://th.bing.com/th/id/OIP.1K-VdFvj6lgInH3jenVVswAAAA?w=119&h=128&c=7&r=0&o=5&dpr=1.5&pid=1.7" alt="Unimar" style="max-width: 70px; height: auto;">
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; padding-top: 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">¡Felicidades {{ $name }}!</h1>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Contenido principal -->
        <tr>
            <td style="padding: 30px 20px;">
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Nos complace informarte que tu aplicación para el puesto de <br>
                    <strong style="color: #0052a5; font-size: 18px;">{{ $puesto }}</strong> <br>
                    ha sido <strong style="color: #28a745;">aceptada</strong>.
                </p>

                <div style="background-color: #f0f6ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <h2 style="color: #0052a5; font-size: 20px; margin: 0 0 15px 0;">Próximos pasos:</h2>
                    <ul style="color: #333333; padding-left: 20px; margin: 0;">
                        <li style="margin-bottom: 10px;">Contactaremos contigo en los próximos 3 días hábiles</li>
                        <li style="margin-bottom: 10px;">Prepara tu documentación para la contratación</li>
                        <li>Revisa tu correo electrónico frecuentemente</li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{{ config('app.url') }}" style="background-color: #0052a5; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Acceder a la Plataforma
                    </a>
                </div>
            </td>
        </tr>

        <!-- Pie de página -->
        <tr>
            <td style="background-color: #f5f7fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                <p style="color: #666666; font-size: 12px; margin: 0;">
                    Este mensaje fue enviado por la Universidad de Margarita<br>
                    Av. Principal, Margarita - Venezuela<br>
                    <a href="[URL_WEB_OFICIAL]" style="color: #0052a5; text-decoration: none;">www.portalunimar.com</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>