<!DOCTYPE html>
<html>
<head>
    <title>Aplicación Revisada - UNIMAR</title>
    <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
    <!-- Contenedor principal -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Encabezado -->
        <tr>
            <td style="background-color: #dc3545; padding: 30px 20px; border-radius: 8px 8px 0 0;">
                <table width="100%">
                    <tr>
                        <td style="text-align: center;">
                            <img src="https://th.bing.com/th/id/OIP.1K-VdFvj6lgInH3jenVVswAAAA?w=119&h=128&c=7&r=0&o=5&dpr=1.5&pid=1.7" alt="Unimar" style="max-width: 200px; height: auto;">
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; padding-top: 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Gracias por tu interés {{ $name }}</h1>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Contenido principal -->
        <tr>
            <td style="padding: 30px 20px;">
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Después de cuidadosa consideración, lamentamos informarte que tu aplicación para el puesto de <br>
                    <strong style="color: #dc3545; font-size: 18px;">{{ $puesto }}</strong> <br>
                    no ha sido seleccionada en esta oportunidad.
                </p>

                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <h2 style="color: #dc3545; font-size: 20px; margin: 0 0 15px 0;">Próximos pasos:</h2>
                    <ul style="color: #333333; padding-left: 20px; margin: 0;">
                        <li style="margin-bottom: 10px;">Tu perfil permanecerá en nuestra base de datos</li>
                        <li style="margin-bottom: 10px;">Te invitamos a aplicar a futuras vacantes</li>
                        <li>Mejoraremos continuamente nuestro proceso de selección</li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <p style="color: #666; font-size: 14px;">
                        "El éxito no es definitivo, el fracaso no es fatal: <br>
                        es el coraje para continuar lo que cuenta." <br>
                        <em>- Winston Churchill</em>
                    </p>
                </div>
            </td>
        </tr>

        <!-- Pie de página -->
        <tr>
            <td style="background-color: #f5f7fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                <p style="color: #666666; font-size: 12px; margin: 0;">
                    Equipo de Reclutamiento - Unimar<br>
                    <a href="[URL_VACANTES]" style="color: #dc3545; text-decoration: none;">Ver otras vacantes disponibles</a><br>
                    <a href="[URL_WEB_OFICIAL]" style="color: #0052a5; text-decoration: none;">www.portalunimar.com</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>