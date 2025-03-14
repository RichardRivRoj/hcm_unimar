'use client'

import { useState } from 'react'
import {
    BookMarked,
    BookUser,
    ClipboardPlus,
    FileBadge,
    FileUser,
    GraduationCap,
    IdCard,
    Newspaper,
    School,
    ScrollText,
} from 'lucide-react'
import CourseDocuments from './CourseDocuments'
import CertificateDocuments from './CertificateDocuments'
import DiplomaDocuments from './DiplomaDocuments'
import IdentificationDocuments from './IdentificationDocuments'
import ContractDocuments from './ContractDocuments'
import BankAccountDocuments from './BankAccountDocuments'
import ReposeDocuments from './ReposeDocuments'
import ReferenceDocuments from './ReferenceDocuments'
import DocumentPreview from '@/components/DocumentPreview'
import EmploymentDocuments from './EmploymentDocuments'
import StudyDocuments from './StudyDocuments'

const documentCategories = [
    { id: 1, name: 'Contratos', icon: <ScrollText /> }, // Asegúrate que existe esta categoría
    { id: 2, name: 'Identificaciones', icon: <IdCard /> },
    { id: 3, name: 'Cuentas de Banco', icon: <FileUser /> },
    { id: 4, name: 'Estudios', icon: <GraduationCap /> },
    { id: 5, name: 'Certificados', icon: <School /> },
    { id: 6, name: 'Diplomados', icon: <FileBadge /> },
    { id: 7, name: 'Cursos', icon: <Newspaper /> },
    { id: 8, name: 'Empleos', icon: <BookUser /> },
    { id: 9, name: 'Reposos', icon: <ClipboardPlus /> },
    { id: 10, name: 'Referencias', icon: <BookMarked /> },
]

const DigitalFile = () => {
    const [selectedCategory, setSelectedCategory] = useState('Contratos')
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

                        {/* Renderizado condicional unificado */}
                        {selectedCategory === 'Contratos' && (
                            <ContractDocuments />
                        )}
                        {selectedCategory === 'Empleos' && (
                            <EmploymentDocuments />
                        )}
                        {selectedCategory === 'Estudios' && <StudyDocuments />}
                        {selectedCategory === 'Cursos' && <CourseDocuments />}
                        {selectedCategory === 'Certificados' && (
                            <CertificateDocuments />
                        )}
                        {selectedCategory === 'Diplomados' && (
                            <DiplomaDocuments />
                        )}
                        {selectedCategory === 'Identificaciones' && (
                            <IdentificationDocuments />
                        )}
                        {selectedCategory === 'Cuentas de Banco' && (
                            <BankAccountDocuments />
                        )}
                        {selectedCategory === 'Reposos' && <ReposeDocuments />}
                        {selectedCategory === 'Referencias' && (
                            <ReferenceDocuments />
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

export default DigitalFile;
