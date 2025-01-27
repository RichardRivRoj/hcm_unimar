'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';

import LoginLinks from '@/app/LoginLinks'
import Header from './Header'
import ProfileCard from '@/components/ProfileCard'
import Link from 'next/link'
import Footer from './Footer'
import JobList from '@/components/JobList';

const Home = () => {
    const [selectedImage, setSelectedImage] = useState(null)
    const router = useRouter();

    // Información de cada imagen
    const imageDetails = {
        subsistema: [
            'La Dirección de Talento Humano de la Universidad de Margarita, es un subsistema encargado de materializar las políticas y demás directrices inherentes al área de su competencia, mediante la orientación que dicte el Rectorado, a través de estrategias, normas, procedimientos y decisiones que coadyuven a la buena marcha de tal función.',
            'Asimismo, es responsable de gestionar lo concerniente al personal Administrativo, Docente, Ambientalista y de Prevención y Control, en relación al reclutamiento, selección, contratación, adiestramiento, registro y nóminas.',
        ],
        objetivos: [
            'La Dirección de Talento Humano de la Universidad de Margarita cumple con generar valor agregado a la Institución con el desarrollo e ingreso de personal calificado',
        ],
        misión: [
            'Mantener el Talento Humano calificado y requerido por la Institución, mediante la incorporación, desarrollo, evaluación, mantenimiento, clasificación de los cargos, y el registro de la información del trabajador.',
        ],
        visión: [
            'Ser reconocidos como la unidad de apoyo administrativo que ha contribuido con eficiencia y efectividad a los objetivos de la Gestión Académica y de los trabajadores universitarios.',
        ],
    }

    const handleImageClick = (e, imageAlt) => {
        e.preventDefault()
        setSelectedImage(imageAlt === selectedImage ? null : imageAlt)
    }

    return (
        <>
            <Header />

            <main className="bg-white">
                <div className="bg-white">
                    <img
                        src="/humanstalent.jpg"
                        alt="Talento Humano"
                        className="w-full lg:h-[345px] md:h-48 sm:h-7 object-cover"
                    />
                </div>

                <div className="flex items-center justify-start px-6 py-11">
                    {/* Logo con margen */}
                    <img
                        src="/logo-unimar.png"
                        alt="Talento Humano"
                        className="object-cover w-8 h-8 mr-5"
                    />

                    {/* Texto en negritas */}
                    <h4 className="font-bold text-gray-800">
                        Dirección de Talento Humano
                    </h4>
                </div>

                <div className="grid grid-cols-1 pl-28 gap-7 sm:grid-cols-2">
                    <ProfileCard
                        image="/sujey-avane.png"
                        name="Esp. Sujey Avane"
                        role="Directora de Talento Humano"
                    />
                    <ProfileCard
                        image="/zulangel-marin.png"
                        name="Lic. Zulangel Marín"
                        role="Asistente de Talento Humano"
                    />
                    <ProfileCard
                        image="/hylaris-rojas.png"
                        name="Abg. Hylaris Rojas"
                        role="Asistente Legal"
                    />
                    <ProfileCard
                        image="/cecilia-diaz.png"
                        name="Abg. Cecilia Díaz"
                        role="Analista II"
                    />
                </div>

                <div className="p-6">
                    {/* Contenedor de imágenes */}
                    <ul className="flex justify-center p-10 space-x-14">
                        <li>
                            <Link href="#">
                                <img
                                    src="/rrhh-03.png"
                                    alt="subsistema"
                                    className="object-contain transition cursor-pointer h-48 w-[280px] hover:opacity-80"
                                    onClick={e =>
                                        handleImageClick(e, 'subsistema')
                                    }
                                />
                            </Link>
                        </li>
                        <li>
                            <Link href="#">
                                <img
                                    src="/rrhh-02.png"
                                    alt="objetivos"
                                    className="object-contain h-48 w-[280px] transition cursor-pointer hover:opacity-80"
                                    onClick={e =>
                                        handleImageClick(e, 'objetivos')
                                    }
                                />
                            </Link>
                        </li>
                        <li>
                            <Link href="#">
                                <img
                                    src="/rrhh-04.png"
                                    alt="misión"
                                    className="object-contain h-48 w-[280px] transition cursor-pointer hover:opacity-80"
                                    onClick={e => handleImageClick(e, 'misión')}
                                />
                            </Link>
                        </li>
                        <li>
                            <Link href="#">
                                <img
                                    src="/rrhh-05.png"
                                    alt="visión"
                                    className="object-contain h-48 w-[280px] transition cursor-pointer hover:opacity-80"
                                    onClick={e => handleImageClick(e, 'visión')}
                                />
                            </Link>
                        </li>
                    </ul>

                    {/* Información desplegable */}
                    <div
                        className={` bg-white pl-10 pr-6 transform transition-transform duration-300 ${
                            selectedImage
                                ? 'scale-100 opacity-100'
                                : 'scale-95 opacity-0 pointer-events-none'
                        }`}>
                        {selectedImage && (
                            <>
                                <h3 className="text-2xl font-bold text-blue-900 capitalize">
                                    {selectedImage}
                                </h3>
                                <ul className="mt-2 space-y-2 text-sm list-disc list-inside">
                                    {imageDetails[selectedImage].map(
                                        (detail, index) => (
                                            <li
                                                key={index}
                                                className="text-gray-700">
                                                {detail}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </>
                        )}
                    </div>

                    {/* Publicaciones laborales */}
                    <div className="p-6">
                        <h4 className="mb-4 text-xl font-bold text-gray-800">
                            Ofertas Laborales
                        </h4>
                        <JobList />
                        
                    </div>

                    {/* Información de contacto */}
                    <div className="flex flex-col items-start px-6 py-5 space-y-4">
                        <h4 className="text-xl font-bold text-gray-800">
                            Información de Contacto:
                        </h4>
                        <div className="flex items-center">
                            <p className="text-base font-bold text-gray-800">
                                Correo electrónico:
                            </p>
                            <p className="ml-2 text-base font-normal text-blue-800">
                                rrhh@unimar.edu.ve
                            </p>
                        </div>
                        <div className="flex items-center">
                            <p className="text-base font-bold text-gray-800">
                                Horario de atención:
                            </p>
                            <p className="ml-2 text-base font-normal text-blue-800">
                                Lunes - Viernes 8:00am - 12:00pm y 1:00pm - 5:00pm
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    )
}

export default Home
