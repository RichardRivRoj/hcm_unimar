'use client'

import Image from 'next/image';
import { useEffect, useState } from 'react';

const Profile = () => {
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const mockData = {
      name: 'Juan Pérez',
      position: 'Desarrollador Frontend',
      startDate: '15/02/2020',
      email: 'juan.perez@example.com',
      phone: '+1 555 555 555',
      department: 'Tecnología',
      summary:
        'Desarrollador apasionado con más de 5 años de experiencia en proyectos web y tecnologías modernas.',
      roles: [
        { position: 'Junior Developer', startDate: '15/02/2020', endDate: '01/01/2021' },
        { position: 'Mid Developer', startDate: '02/01/2021', endDate: 'Presente' },
      ],
      image: '/perfil.png', // Ruta de ejemplo de la imagen
      cvUrl: '/cv-example.pdf', // Ruta de ejemplo para el CV
    };

    // Simulamos un retardo como si fuera una API
    setTimeout(() => setEmployee(mockData), 1000);
  }, []);

  if (!employee) {
    return <div className="text-center text-gray-600">Cargando...</div>;
  }

  return (
    <div className="max-w-4xl p-6 mx-auto rounded-lg shadow-md bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24">
          <Image
            src={employee.image || '/placeholder-image.png'}
            alt="Foto de perfil"
            width={100}
            height={100}
            className="object-cover rounded-full"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{employee.name}</h1>
          <p className="text-gray-600">{employee.position}</p>
          <p className="text-sm text-gray-500">
            Empleado desde: <span className="font-semibold">{employee.startDate}</span>
          </p>
        </div>
      </div>

      {/* Datos Personales */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <h2 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b">
          Datos Personales
        </h2>
        <ul className="space-y-2">
          <li>
            <strong className="text-gray-700">Email:</strong> {employee.email}
          </li>
          <li>
            <strong className="text-gray-700">Teléfono:</strong> {employee.phone}
          </li>
          <li>
            <strong className="text-gray-700">Departamento:</strong> {employee.department}
          </li>
        </ul>
      </div>

      {/* Resumen Profesional */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <h2 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b">
          Resumen Profesional
        </h2>
        <p className="text-gray-600">{employee.summary || 'No hay información disponible.'}</p>
      </div>

      {/* Cargos y Tiempos */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <h2 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b">
          Cargos y Tiempos
        </h2>
        <ul className="space-y-2">
          {employee.roles.map((role, index) => (
            <li key={index}>
              <span className="font-semibold text-gray-700">{role.position}</span> -{' '}
              {role.startDate} a {role.endDate || 'Presente'}
            </li>
          ))}
        </ul>
      </div>

      {/* CV */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b">Currículum Vitae</h2>
        <a
          href={employee.cvUrl || '#'}
          className="inline-block px-4 py-2 text-white transition bg-blue-600 rounded-md shadow hover:bg-blue-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver CV
        </a>
      </div>
    </div>
  );
};

export default Profile;