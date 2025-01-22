import Link from 'next/link'

const Footer = () => {
    return (
        <footer className="w-full bg-[#0d4d98] text-white">
            {/* Contenedor principal */}
            <div className="flex flex-col items-center justify-between px-6 py-8 md:space-y-4 md:flex-row">
                {/* Logo y ubicación */}
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:text-sm">
                    <div className="flex flex-col items-center text-center md:items-center md:text-center">
                        <img
                            src="/logo-unimar-22.png"
                            alt="Unimar Logo"
                            className="object-contain h-24 mb-4 w-28"
                        />
                        <p className="text-xs">
                            Av. Concepción Mariño, Sector El Toporo, El Valle
                            del Espíritu Santo, Edo. Nueva Esparta, Venezuela.
                        </p>
                    </div>

                    {/* Secciones de navegación */}

                    {/* Parte 1 */}
                    <div className=''>
                        <h4 className="mb-3 font-bold">Nuestra Institución</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="hover:underline">
                                    Rectorado
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Vicerrectorado
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Decanatos
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Bienestar Estudiantil
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Parte 2 */}
                    <div>
                        <h4 className="mb-3 font-bold">Ofertas de Estudios</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="hover:underline">
                                    Pregrado
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Postgrado
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Diplomados
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Cursos y Talleres
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Parte 3 */}
                    <div>
                        <h4 className="mb-3 font-bold">Servicios Web</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="hover:underline">
                                    Académicos
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Biblioteca UNIMAR
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Educación Virtual
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Pagos Online
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Parte 4 */}
                    <div>
                        <h4 className="mb-3 font-bold">Accesos Rápidos</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="hover:underline">
                                    Directorio Académico
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Calendario Académico
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:underline">
                                    Contáctanos
                                </Link>
                            </li>
                        </ul>

                        {/* Redes sociales */}
                        <div className="flex mt-4 space-x-3">
                            <Link href="#" className="flex items-center">
                                <img
                                    src="/email.png"
                                    alt="Email"
                                    className="object-contain w-6 h-6"
                                />
                            </Link>
                            <Link href="#" className="flex items-center">
                                <img
                                    src="/facebook.png"
                                    alt="Facebook"
                                    className="object-contain w-6 h-6"
                                />
                            </Link>
                            <Link href="#" className="flex items-center">
                                <img
                                    src="/instagram.png"
                                    alt="Instagram"
                                    className="object-contain w-6 h-6"
                                />
                            </Link>
                            <Link href="#" className="flex items-center">
                                <img
                                    src="/youtube-03.png"
                                    alt="YouTube"
                                    className="object-contain w-6 h-6"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="pt-1 pb-2 mt-8 text-center border-white/30">
                <p className="text-xs">
                    © Copyright 2001-2025 Universidad de Margarita, Rif:
                    J-30660040-0. Isla de Margarita - Venezuela.
                </p>
            </div>
        </footer>
    )
}

export default Footer
