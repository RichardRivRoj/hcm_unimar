<!DOCTYPE html>
<html>
<head>
    <title>Aplicación Revisada - UNIMAR</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f9fa;">
    <!-- Preheader -->
    <div style="display: none; max-height: 0; overflow: hidden;">
        Actualización de estado de aplicación - Universidad de Margarita
    </div>

    <!-- Contenedor principal -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,75,154,0.1);">
        <!-- Encabezado corporativo -->
        <tr>
            <td style="background-color: #004b9a; padding: 30px 20px; border-radius: 8px 8px 0 0;">
                <table width="100%" align="center">
                    <tr>
                        <td style="text-align: center;">
                            <img src="{{ Storage::disk('email_assets')->url('header2.png') }}" alt="Universidad de Margarita" style="max-width: 180px; height: auto; display: block; margin: 0 auto;">
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Cuerpo del mensaje -->
        <tr>
            <td style="padding: 40px 30px;">
                <!-- Saludo -->
                <h1 style="color: #004b9a; font-size: 26px; margin: 0 0 25px 0; font-weight: 600;">
                    Estimado/a {{ $name }},
                </h1>

                <!-- Contenido principal -->
                <div style="color: #444444; font-size: 16px; line-height: 1.6;">
                    <p style="margin: 0 0 20px 0;">
                        Después de una cuidadosa revisión de tu postulación para el cargo de:<br>
                        <strong style="color: #004b9a; font-size: 18px;">{{ $puesto }}</strong><br>
                        en el departamento de <strong>{{ $departamento }}</strong>, lamentamos informarte que no hemos podido avanzar con tu aplicación en esta oportunidad.
                    </p>

                    <!-- Destacado -->
                    <div style="background-color: #fff5f5; border-left: 4px solid #dc3545; padding: 20px; margin: 25px 0; border-radius: 4px;">
                        <h2 style="color: #dc3545; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">
                            ¿Qué sigue ahora?
                        </h2>
                        <ul style="padding-left: 20px; margin: 0;">
                            <li style="margin-bottom: 12px; padding-left: 8px;">📁 Tu perfil permanecerá en nuestra base de datos por 12 meses</li>
                            <li style="margin-bottom: 12px; padding-left: 8px;">🔍 Te invitamos a explorar nuevas oportunidades en nuestro portal</li>
                            <li style="padding-left: 8px;">📩 Recibirás alertas de vacantes afines a tu perfil</li>
                        </ul>
                    </div>

                    <!-- Motivación -->
                    <div style="text-align: center; margin: 30px 0; padding: 20px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
                        <p style="color: #666; font-style: italic; margin: 0;">
                            "El éxito no es final, el fracaso no es fatal:<br>
                            es el valor para continuar lo que cuenta"<br>
                            <span style="color: #004b9a;">- Winston Churchill</span>
                        </p>
                    </div>

                    <!-- Llamado a la acción -->
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 30px auto;">
                        <tr>
                            <td style="background-color: #004b9a; border-radius: 5px; text-align: center;">
                                <a href="#" style="color: #ffffff; text-decoration: none; padding: 14px 35px; display: inline-block; font-weight: 500; font-size: 16px;">
                                    Ver Oportunidades Disponibles
                                </a>
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>

        <!-- Pie de página corporativo -->
        <tr>
            <td style="background-color: #f8f9fa; padding: 30px 20px; border-radius: 0 0 8px 8px;">
                <table width="100%">
                    <tr>
                        <td style="text-align: center; padding: 10px 0;">
                            <img src="{{ Storage::disk('email_assets')->url('footer2.png') }}" alt="UNIMAR" style="max-width: 280px; height: auto;">
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; padding: 10px 0;">
                            <p style="color: #666666; font-size: 12px; line-height: 1.5; margin: 0;">
                                Universidad de Margarita<br>
                                Av. Bolívar, Valle del Espíritu Santo, Isla de Margarita - Venezuela<br>
                                Teléfono: +58 295-0000000 | Email: rrhh@unimar.edu.ve
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; padding: 15px 0 0 0;">
                            <p style="color: #999999; font-size: 11px; margin: 5px 0;">
                                <a href="#" style="color: #004b9a; text-decoration: none;">Políticas de Privacidad</a> | 
                                <a href="#" style="color: #004b9a; text-decoration: none;">Aviso Legal</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>