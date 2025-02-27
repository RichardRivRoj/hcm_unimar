<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class DepartmentUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
     
        // Ruta de la imagen predeterminada
        $defaultImagePath = 'default/department_default.jpg';

        $departments = [
            [
                'name' => 'Talento Humano',
                'description' => 'Dirección de Talento Humano.',
                'code' => 1,
                'mission' => 'Gestionar el talento humano para el desarrollo organizacional.',
                'vision' => 'Ser el área líder en la gestión de personas.',
                'responsibilities' => ['Reclutamiento', 'Capacitación', 'Nómina', 'Evaluaciones'],
                'objectives' => ['Mejorar el clima laboral', 'Fomentar el desarrollo profesional'],
                'contact_info' => 'rrhh@unimar.edu.ve',
                'file_path' => $defaultImagePath, // Usar la imagen predeterminada
                'extra_data' => ['color' => '#FF5733', 'manager' => 'Ana Pérez'],
                'status_id' => 1,
                'email' => 'rrhh@unimar.edu.ve',
                'password' => Hash::make('password123'),
                'roles' => ['admin', 'supervisor'],
            ],
            [
                'name' => 'Informática',
                'description' => 'Dirección de Informática.',
                'code' => 2,
                'mission' => 'Innovar y proveer soluciones tecnológicas.',
                'vision' => 'Ser el soporte tecnológico de la organización.',
                'responsibilities' => ['Mantenimiento de sistemas', 'Desarrollo de software'],
                'objectives' => ['Implementar nuevas tecnologías', 'Optimizar procesos'],
                'contact_info' => 'tecnologia@unimar.edu.ve',
                'file_path' => $defaultImagePath, // Usar la imagen predeterminada
                'extra_data' => ['color' => '#33C1FF', 'manager' => 'Carlos Gómez'],
                'status_id' => 1,
                'email' => 'tecnologia@unimar.edu.ve',
                'password' => Hash::make('password123'),
                'roles' => ['supervisor'],
            ],
            [
                'name' => 'Finanzas',
                'description' => 'Departamento de Finanzas.',
                'code' => 3,
                'mission' => 'Gestionar los recursos financieros de la organización.',
                'vision' => 'Maximizar la rentabilidad y eficiencia financiera.',
                'responsibilities' => ['Contabilidad', 'Presupuestos', 'Auditoría'],
                'objectives' => ['Reducir costos', 'Optimizar inversiones'],
                'contact_info' => 'finanzas@unimar.edu.ve',
                'file_path' => $defaultImagePath,
                'extra_data' => ['color' => '#33FF57', 'manager' => 'Luisa Martínez'],
                'status_id' => 1,
                'email' => 'finanzas@unimar.edu.ve',
                'password' => Hash::make('password123'),
                'roles' => ['supervisor'],
            ],
            [
                'name' => 'Marketing',
                'description' => 'Departamento de Marketing.',
                'code' => 4,
                'mission' => 'Promover la marca y generar estrategias de mercado.',
                'vision' => 'Ser líder en estrategias de marketing digital.',
                'responsibilities' => ['Publicidad', 'Redes sociales', 'Análisis de mercado'],
                'objectives' => ['Aumentar la visibilidad de la marca', 'Generar leads'],
                'contact_info' => 'marketing@unimar.edu.ve',
                'file_path' => $defaultImagePath,
                'extra_data' => ['color' => '#FFC300', 'manager' => 'Jorge Ramírez'],
                'status_id' => 1,
                'email' => 'marketing@unimar.edu.ve',
                'password' => Hash::make('password123'),
                'roles' => ['supervisor'],
            ],
            [
                'name' => 'Logística',
                'description' => 'Departamento de Logística.',
                'code' => 5,
                'mission' => 'Optimizar la cadena de suministro y distribución.',
                'vision' => 'Ser el área más eficiente en gestión logística.',
                'responsibilities' => ['Inventarios', 'Transporte', 'Almacenamiento'],
                'objectives' => ['Reducir tiempos de entrega', 'Minimizar costos logísticos'],
                'contact_info' => 'logistica@unimar.edu.ve',
                'file_path' => $defaultImagePath,
                'extra_data' => ['color' => '#8E44AD', 'manager' => 'María Fernández'],
                'status_id' => 1,
                'email' => 'logistica@unimar.edu.ve',
                'password' => Hash::make('password123'),
                'roles' => ['supervisor'],
            ],
            [
                'name' => 'Prevención y Control',
                'description' => 'Departamento de prevención y control de riesgos.',
                'code' => 6,
                'mission' => 'Garantizar un entorno seguro y saludable para toda la comunidad universitaria.',
                'vision' => 'Ser el referente en prevención y control de riesgos a nivel institucional.',
                'responsibilities' => ['Inspecciones de seguridad', 'Capacitación en prevención', 'Gestión de emergencias'],
                'objectives' => ['Reducir incidentes de seguridad', 'Fomentar una cultura preventiva'],
                'contact_info' => 'prevencion@unimar.edu.ve',
                'file_path' => $defaultImagePath, // Imagen predeterminada
                'extra_data' => ['color' => '#FF5733', 'manager' => 'Laura Gómez'],
                'status_id' => 1,
                'email' => 'prevencion@unimar.edu.ve',
                'password' => Hash::make('password123'),
                'roles' => ['supervisor'],
            ],
            [
                'name' => 'Administración',
                'description' => 'Dirección de Administración.',
                'code' => 7,
                'mission' => 'Optimizar los recursos administrativos para garantizar la eficiencia operativa.',
                'vision' => 'Ser el soporte administrativo más eficiente de la organización.',
                'responsibilities' => ['Gestión de recursos', 'Coordinación de procesos', 'Control presupuestario'],
                'objectives' => ['Mejorar la eficiencia administrativa', 'Reducir costos operativos'],
                'contact_info' => 'administracion@unimar.edu.ve',
                'file_path' => $defaultImagePath, // Imagen predeterminada
                'extra_data' => ['color' => '#33C1FF', 'manager' => 'Carlos Ramírez'],
                'status_id' => 1,
                'email' => 'administracion@unimar.edu.ve',
                'password' => Hash::make('password123'),
                'roles' => ['supervisor'],
            ],
            [
                'name' => 'Servicios Generales',
                'description' => 'Departamento de Servicios Generales.',
                'code' => 8,
                'mission' => 'Brindar servicios de calidad para el mantenimiento de las instalaciones.',
                'vision' => 'Ser el área líder en servicios de soporte y mantenimiento.',
                'responsibilities' => ['Mantenimiento de infraestructura', 'Limpieza', 'Logística de eventos'],
                'objectives' => ['Optimizar los servicios de mantenimiento', 'Garantizar la funcionalidad de las instalaciones'],
                'contact_info' => 'serviciosgenerales@unimar.edu.ve',
                'file_path' => $defaultImagePath, // Imagen predeterminada
                'extra_data' => ['color' => '#33FF57', 'manager' => 'Marta López'],
                'status_id' => 1,
                'email' => 'serviciosgenerales@unimar.edu.ve',
                'password' => Hash::make('password123'),
                'roles' => ['supervisor'],
            ],
            [
                'name' => 'Biblioteca',
                'description' => 'Coordinacion de Biblioteca.',
                'code' => 9,
                'mission' => 'Proveer acceso a recursos de información para el aprendizaje y la investigación.',
                'vision' => 'Ser el centro de conocimiento más importante de la institución.',
                'responsibilities' => ['Gestión de libros', 'Préstamo de materiales', 'Servicios de consulta'],
                'objectives' => ['Digitalizar el catálogo', 'Ampliar la colección bibliográfica'],
                'contact_info' => 'biblioteca@unimar.edu.ve',
                'file_path' => $defaultImagePath, // Imagen predeterminada
                'extra_data' => ['color' => '#FFC300', 'manager' => 'José Fernández'],
                'status_id' => 1,
                'email' => 'biblioteca@unimar.edu.ve',
                'password' => Hash::make('password123'),
                'roles' => ['supervisor'],
            ],
            [
                'name' => 'Decanato de Ingeniería y Afines',
                'description' => 'Decanato de Ingeniería y Afines.',
                'code' => 10,
                'mission' => 'Formar profesionales de ingeniería con excelencia académica y ética.',
                'vision' => 'Ser el decanato líder en la formación de ingenieros a nivel nacional.',
                'responsibilities' => ['Gestión académica', 'Coordinación de programas', 'Supervisión de proyectos'],
                'objectives' => ['Mejorar la calidad académica', 'Fomentar la investigación'],
                'contact_info' => 'decanatoingenieria@unimar.edu.ve',
                'file_path' => $defaultImagePath, // Imagen predeterminada
                'extra_data' => ['color' => '#8E44AD', 'manager' => 'Pedro Martínez'],
                'status_id' => 1,
                'email' => 'decanatoingenieria@unimar.edu.ve',
                'password' => Hash::make('password123'),
                'roles' => ['supervisor'],
            ],
        ];

        foreach ($departments as $departmentData) {
            // Crear el departamento
            $department = Department::create([
                'name' => $departmentData['name'],
                'description' => $departmentData['description'],
                'code' => $departmentData['code'],
                'mission' => $departmentData['mission'],
                'vision' => $departmentData['vision'],
                'responsibilities' => json_encode($departmentData['responsibilities']), // Convertir a JSON
                'objectives' => json_encode($departmentData['objectives']), // Convertir a JSON
                'contact_info' => $departmentData['contact_info'],
                'file_path' => $departmentData['file_path'],
                'extra_data' => json_encode($departmentData['extra_data']), // Convertir a JSON
                'status_id' => $departmentData['status_id'],
            ]);
        
            // Crear el usuario departamental
            $user = User::create([
                'email' => $departmentData['email'],
                'password' => $departmentData['password'],
                'department_id' => $department->id,
            ]);
        
            // Asignar roles al usuario
            foreach ($departmentData['roles'] as $roleName) {
                $user->assignRole($roleName);
            }
        }
    }
}
