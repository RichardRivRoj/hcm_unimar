'use client'

import { useState } from 'react'

import DocumentPreview from './DocumentPreview'
import EmploymentDocuments from './EmploymentDocuments'
import StudyDocuments from './StudyDocuments'
import {
    BookMarked,
    BriefcaseBusiness,
    FolderCog,
    GraduationCap,
    IdCard,
    NotepadText,
    School,
} from 'lucide-react'
import CourseDocuments from './CourseDocuments'
import CertificateDocuments from './CertificateDocuments'
import DiplomaDocuments from './DiplomaDocuments'
import IdentificationDocuments from './IdentificationDocuments'

const documentCategories = [
    { id: 1, name: 'Empleos', icon: <BriefcaseBusiness /> }, // Asegúrate que existe esta categoría
    { id: 2, name: 'Estudios', icon: <GraduationCap /> },
    { id: 3, name: 'Cursos', icon: <FolderCog /> },
    { id: 4, name: 'Certificados', icon: <NotepadText /> },
    { id: 5, name: 'Diplomados', icon: <School /> },
    { id: 6, name: 'Identificaciones', icon: <IdCard /> },
]

export default function DigitalFile() {
    const [selectedCategory, setSelectedCategory] = useState('Empleos')
    const [selectedDocument, setSelectedDocument] = useState(null)

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar de Categorías */}
            <div className="w-64 p-4 bg-white border-r border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-[#004b9a]">
                    Mi Expediente
                </h2>
                <nav>
                    {documentCategories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => {
                                setSelectedCategory(category.name)
                                setSelectedDocument(null)
                            }}
                            className={`w-full flex items-center p-2 mb-1 rounded-lg ${
                                selectedCategory === category.name
                                    ? 'bg-[#004b9a] text-white'
                                    : 'hover:bg-gray-100'
                            }`}>
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Contenido Principal - Modificado */}
            <div className="flex-1 p-8 overflow-auto scrollbar-none">
                {!selectedDocument ? (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {selectedCategory}
                            </h1>
                        </div>

                        {selectedCategory === 'Empleos' ? (
                            <EmploymentDocuments /> // Componente personalizado para empleos
                        ) : (
                            // Contenido original para otras categorías
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
                        )}

                        {selectedCategory === 'Estudios' ? (
                            <StudyDocuments /> // Componente personalizado para Estudios
                        ) : (
                            // Contenido original para otras categorías
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
                        )}

                        {selectedCategory === 'Cursos' ? (
                            <CourseDocuments /> // Componente personalizado para Cursos
                        ) : (
                            // Contenido original para otras categorías
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
                        )}

                        {selectedCategory === 'Certificados' ? (
                            <CertificateDocuments /> // Componente personalizado para Cursos
                        ) : (
                            // Contenido original para otras categorías
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
                        )}
                        {selectedCategory === 'Diplomados' ? (
                            <DiplomaDocuments /> // Componente personalizado para Cursos
                        ) : (
                            // Contenido original para otras categorías
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
                        )}

                        {selectedCategory === 'Identificaciones' ? (
                            <IdentificationDocuments /> // Componente personalizado para Cursos
                        ) : (
                            // Contenido original para otras categorías
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
                        )}
                    </>
                ) : (
                    <DocumentPreview
                        document={selectedDocument}
                        onClose={() => setSelectedDocument(null)}
                    />
                )}
            </div>
        </div>
    )
}
