'use client'

import LoginLinks from '@/app/LoginLinks'
import DollarPrice from '@/components/DolarPrice'
import Link from 'next/link'
import { useState } from 'react'

const Header = () => {
    const [openMenu, setOpenMenu] = useState(null) // Controla qué menú está abierto
    const [openSubMenu, setOpenSubMenu] = useState(null) // Controla qué submenú está abierto

    const toggleMenu = menu => {
        setOpenMenu(openMenu === menu ? null : menu) // Alterna el estado del menú
    }

    const toggleSubMenu = submenu => {
        setOpenSubMenu(openSubMenu === submenu ? null : submenu) // Alterna el submenú
    }

    return (
        <header className="relative bg-white dark:bg-gray-900">
            <DollarPrice />
            <div className="max-w-full py-0 mx-auto sm:py-6 lg:py-0">
                <nav className="flex items-center justify-between">
                    <LoginLinks />
                </nav>

                <div className="flex items-center justify-between w-full px-6 py-4 bg-white">
                    {/* Imagen alineada a la izquierda */}
                    <Link href="#">
                        <img
                            src="/logounimar-22.jpg"
                            alt="Unimar"
                            className="object-contain w-56 h-16"
                        />
                    </Link>

                    {/* Opciones alineadas a la derecha */}
                    <nav>
                        <ul className="flex space-x-8 text-[14px] font-medium text-gray-700 md:text-[12px]">
                            <li>
                                <Link href="#" className="hover:text-blue-600">
                                    Inicio
                                </Link>
                            </li>
                            <li className="relative group">
                                <button
                                    onClick={() => toggleMenu('institucion')}
                                    className="hover:text-blue-600">
                                    Nuestra Institución
                                </button>
                                {/* Submenú */}
                                {openMenu === 'institucion' && (
                                    <ul className="absolute w-40 mt-2 bg-white border border-gray-200 rounded-md shadow-lg -left-3 text-[12px]">
                                        <li className="hover:bg-gray-100">
                                            <Link
                                                href="#"
                                                className="block px-4 py-2">
                                                UNIMAR
                                            </Link>
                                        </li>
                                        <li className="hover:bg-gray-100">
                                            <Link
                                                href="#"
                                                className="block px-4 py-2">
                                                Organización
                                            </Link>
                                        </li>

                                        <li className="relative hover:bg-gray-100">
                                            <button
                                                onClick={() =>
                                                    toggleSubMenu(
                                                        'rectorado',
                                                    )
                                                }
                                                className="flex items-center justify-between w-full px-4 py-2">
                                                Rectorado
                                                <span className="ml-2">▶</span>
                                            </button>
                                            {openSubMenu === 'rectorado' && (
                                                <ul className="absolute top-0 bg-white border border-gray-200 rounded-md shadow-lg ml-[2px] w-80 left-full">
                                                    <li className="hover:bg-gray-100">
                                                        <Link
                                                            href="#"
                                                            className="block px-4 py-2">
                                                            Nuestro Subsistema
                                                        </Link>
                                                    </li>
                                                    <li className="hover:bg-gray-100">
                                                        <Link
                                                            href="#"
                                                            className="block px-4 py-2">
                                                            Planificacion, Desarrollo y Evaluación Institucional
                                                        </Link>
                                                    </li>
                                                    <li className="hover:bg-gray-100">
                                                        <Link
                                                            href="#"
                                                            className="block px-4 py-2">
                                                            Talento Humano
                                                        </Link>
                                                    </li>
                                                    <li className="hover:bg-gray-100">
                                                        <Link
                                                            href="#"
                                                            className="block px-4 py-2">
                                                            Evaluación y Apoyo Psicológico
                                                        </Link>
                                                    </li>
                                                </ul>
                                            )}
                                        </li>

                                        <li className="hover:bg-gray-100">
                                            <Link
                                                href="#"
                                                className="block px-4 py-2">
                                                Administración
                                            </Link>
                                        </li>
                                        <li className="hover:bg-gray-100">
                                            <Link
                                                href="#"
                                                className="block px-4 py-2">
                                                Normativas
                                            </Link>
                                        </li>
                                        <li className="hover:bg-gray-100">
                                            <Link
                                                href="#"
                                                className="block px-4 py-2">
                                                Publicaciones Oficiales
                                            </Link>
                                        </li>
                                        <li className="hover:bg-gray-100">
                                            <Link
                                                href="#"
                                                className="block px-4 py-2">
                                                Comisión Electoral
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>

                            <li className="relative group">
                                <button
                                    onClick={() => toggleMenu('secretaria')}
                                    className="hover:text-blue-600">
                                    Secretaría General
                                </button>
                                {/* Submenú */}
                                {openMenu === 'secretaria' && (
                                    <ul className="absolute w-40 mt-2 bg-white border border-gray-200 rounded-md shadow-lg -left-3 text-[12px]">
                                        <li className="hover:bg-gray-100">
                                            <Link
                                                href="#"
                                                className="block px-4 py-2">
                                                Nuestro Subsistema
                                            </Link>
                                        </li>
                                        <li className="hover:bg-gray-100">
                                            <Link
                                                href="#"
                                                className="block px-4 py-2">
                                                Control de Estudio
                                            </Link>
                                        </li>
                                        <li className="hover:bg-gray-100">
                                            <Link
                                                href="#"
                                                className="block px-4 py-2">
                                                Bienestar Estudiantil
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>

                            <li className="relative group">
                                <button
                                    onClick={() => toggleMenu('academico')}
                                    className="hover:text-blue-600">
                                    Académico
                                </button>
                                {/* Submenú */}
                                {openMenu === 'academico' && (
                                    <ul className="absolute w-40 mt-2 bg-white border border-gray-200 rounded-md shadow-lg -left-3 text-[12px]">
                                        <li className="hover:bg-gray-100">
                                            <Link
                                                href="#"
                                                className="block px-4 py-2">
                                                Vicerrectorado
                                            </Link>
                                        </li>
                                        <li className="hover:bg-gray-100">
                                            <Link
                                                href="#"
                                                className="block px-4 py-2">
                                                Biblioteca UNIMAR
                                            </Link>
                                        </li>
                                        
                                        <li className="relative hover:bg-gray-100">
                                            <button
                                                onClick={() =>
                                                    toggleSubMenu(
                                                        'decanato',
                                                    )
                                                }
                                                className="flex items-center justify-between w-full px-4 py-2">
                                                Decanatos
                                                <span className="ml-2">▶</span>
                                            </button>
                                            {openSubMenu === 'decanato' && (
                                                <ul className="absolute top-0 bg-white border border-gray-200 rounded-md shadow-lg ml-[2px] w-56 left-full">
                                                    <li className="hover:bg-gray-100">
                                                        <Link
                                                            href="#"
                                                            className="block px-4 py-2">
                                                            Estudios Generales
                                                        </Link>
                                                    </li>
                                                    <li className="hover:bg-gray-100">
                                                        <Link
                                                            href="#"
                                                            className="block px-4 py-2">
                                                            Humanidades, Artes y Educación
                                                        </Link>
                                                    </li>
                                                    <li className="hover:bg-gray-100">
                                                        <Link
                                                            href="#"
                                                            className="block px-4 py-2">
                                                            Ciencias Económicas y Sociales
                                                        </Link>
                                                    </li>
                                                    <li className="hover:bg-gray-100">
                                                        <Link
                                                            href="#"
                                                            className="block px-4 py-2">
                                                            Ciencias Jurídicas y Políticas
                                                        </Link>
                                                    </li>
                                                    <li className="hover:bg-gray-100">
                                                        <Link
                                                            href="#"
                                                            className="block px-4 py-2">
                                                            Ingeniería y Afines
                                                        </Link>
                                                    </li>
                                                </ul>
                                            )}
                                        </li>
                                        
                                    </ul>
                                )}
                            </li>

                            <li className="relative group">
                                <button
                                    onClick={() => toggleMenu('extension')}
                                    className="hover:text-blue-600">
                                    Extensión
                                </button>
                                {/* Submenú */}
                                {openMenu === 'extension' && (
                                    <ul className="absolute w-40 mt-2 bg-white border border-gray-200 rounded-md shadow-lg -left-3 text-[12px]">
                                        <li className="hover:bg-gray-100">
                                            <Link
                                                href="#"
                                                className="block px-4 py-2">
                                                Vicerrectorado
                                            </Link>
                                        </li>
                                        <li className="hover:bg-gray-100">
                                            <Link
                                                href="#"
                                                className="block px-4 py-2">
                                                Servicio Comunitario
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>

                            <li className="relative group">
                                <button
                                    onClick={() => toggleMenu('estudiante')}
                                    className="hover:text-blue-600">
                                    Estudiantes
                                </button>
                                {/* Submenú */}
                                {openMenu === 'estudiante' && (
                                    <ul className="absolute w-40 mt-2 bg-white border border-gray-200 rounded-md shadow-lg -left-3 text-[12px]">
                                        
                                        <li className="relative hover:bg-gray-100">
                                            <button
                                                onClick={() =>
                                                    toggleSubMenu(
                                                        'pregrado',
                                                    )
                                                }
                                                className="flex items-center justify-between w-full px-4 py-2">
                                                Pregrado
                                                <span className="ml-2">▶</span>
                                            </button>
                                            {openSubMenu === 'pregrado' && (
                                                <ul className="absolute top-0 bg-white border border-gray-200 rounded-md shadow-lg ml-[2px] w-40 left-full">
                                                    <li className="hover:bg-gray-100">
                                                        <Link
                                                            href="#"
                                                            className="block px-4 py-2">
                                                            Requisitos
                                                        </Link>
                                                    </li>
                                                    <li className="hover:bg-gray-100">
                                                        <Link
                                                            href="#"
                                                            className="block px-4 py-2">
                                                            Estudiantes Regulares
                                                        </Link>
                                                    </li>
                                                </ul>
                                            )}
                                        </li>
                                        
                                        <li className="relative hover:bg-gray-100">
                                            <button
                                                onClick={() =>
                                                    toggleSubMenu(
                                                        'postgrado',
                                                    )
                                                }
                                                className="flex items-center justify-between w-full px-4 py-2">
                                                Postgrado
                                                <span className="ml-2">▶</span>
                                            </button>
                                            {openSubMenu === 'postgrado' && (
                                                <ul className="absolute top-0 bg-white border border-gray-200 rounded-md shadow-lg ml-[2px] w-40 left-full">
                                                    <li className="hover:bg-gray-100">
                                                        <Link
                                                            href="#"
                                                            className="block px-4 py-2">
                                                            Requisitos
                                                        </Link>
                                                    </li>
                                                </ul>
                                            )}
                                        </li>
                                        
                                        <li className="relative hover:bg-gray-100">
                                            <button
                                                onClick={() =>
                                                    toggleSubMenu(
                                                        'extensione',
                                                    )
                                                }
                                                className="flex items-center justify-between w-full px-4 py-2">
                                                Extensión
                                                <span className="ml-2">▶</span>
                                            </button>
                                            {openSubMenu === 'extensione' && (
                                                <ul className="absolute top-0 bg-white border border-gray-200 rounded-md shadow-lg ml-[2px] w-40 left-full">
                                                    <li className="hover:bg-gray-100">
                                                        <Link
                                                            href="#"
                                                            className="block px-4 py-2">
                                                            Diplomados
                                                        </Link>
                                                    </li>
                                                    <li className="hover:bg-gray-100">
                                                        <Link
                                                            href="#"
                                                            className="block px-4 py-2">
                                                            Cursos y Talleres
                                                        </Link>
                                                    </li>
                                                </ul>
                                            )}
                                        </li>
                                        
                                        <li className="hover:bg-gray-100">
                                            <Link
                                                href="#"
                                                className="block px-4 py-2">
                                                Egresados
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>

                            <li>
                                <Link href="#" className="hover:text-blue-600">
                                    Postgrado
                                </Link>
                            </li>

                            <li>
                                <Link href="#" className="hover:text-blue-600">
                                    Investigación
                                </Link>
                            </li>

                            <li>
                                <Link href="#" className="hover:text-blue-600">
                                    Servicio
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header
