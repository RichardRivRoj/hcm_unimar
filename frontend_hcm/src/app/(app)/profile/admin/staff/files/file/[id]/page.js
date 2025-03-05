'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import useEmployeeFiles from '@/hooks/admin/useEmployeeFiles'

import {
    BookMarked,
    BookUser,
    BriefcaseBusiness,
    ClipboardPlus,
    FileBadge,
    FileUser,
    FolderCog,
    GraduationCap,
    IdCard,
    Newspaper,
    NotepadText,
    School,
    ScrollText,
} from 'lucide-react'
import DocumentCategory from './DocumentCategory'
import DocumentPreview from '@/components/DocumentPreview'
import EmployeeHeader from './EmployeeHeader'
import { Alert, AlertDescription } from '@/components/alert'
import { Skeleton } from '@/components/skeleton'

export default function DigitalFiles() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const employeeId = params.id
    const {
        selectedEmployee,
        detailLoading,
        detailError,
        pagination,
        handlePageChange,
        fetchEmployeeDetails,
    } = useEmployeeFiles()

    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get('category') || 'Contratos',
    )
    const [selectedDocument, setSelectedDocument] = useState(null)

    // Actualizar URL al cambiar categoría
    const updateCategory = category => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set('category', category)
        newParams.delete('page') // Resetear paginación al cambiar categoría
        router.replace(`?${newParams.toString()}`)
        setSelectedCategory(category)
    }

    // Actualizar URL al cambiar página
    const handlePagination = newPage => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set('page', newPage)
        router.replace(`?${newParams.toString()}`)
        handlePageChange(newPage, selectedCategory)
    }

    // Usar efecto para cargar datos cuando cambian los parámetros
    useEffect(() => {
        const category = searchParams.get('category') || 'Contratos'
        const page = searchParams.get('page') || 1
        setSelectedCategory(category)
        fetchEmployeeDetails(employeeId, category, page)
    }, [searchParams, employeeId])

    const documentCategories = [
        { id: 1, name: 'Contratos', icon: <ScrollText /> },
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

    if (detailLoading)
        return (
            <div className="space-y-4">
                {[...Array([4,4])].map((_, i) => (
                    <Skeleton key={i} className="w-full h-16 rounded-lg" />
                ))}
            </div>
        )
    if (detailError)
        return (
            <Alert>
                <AlertDescription>{detailError}</AlertDescription>
            </Alert>
        )

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 p-4 bg-white border-r border-gray-200">
                <h2 className="mb-4 text-xl font-bold text-[#004b9a]">
                    Expediente Digital
                </h2>
                <nav className="space-y-1">
                    {documentCategories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => {
                                updateCategory(category.name)
                                setSelectedDocument(null)
                            }}
                            className={`w-full flex items-center p-2 rounded-lg ${
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

            {/* Contenido principal */}
            <div className="flex-1 p-8 overflow-auto scrollbar-none">
                {selectedEmployee && (
                    <>
                        <EmployeeHeader employee={selectedEmployee.employee} />

                        {!selectedDocument ? (
                            <DocumentCategory
                                title={selectedCategory}
                                documents={
                                    selectedEmployee.documents.data || []
                                }
                                onDocumentSelect={setSelectedDocument}
                                pagination={selectedEmployee.documents.meta}
                                onPageChange={handlePagination}
                            />
                        ) : (
                            <DocumentPreview
                                document={selectedDocument}
                                onClose={() => setSelectedDocument(null)}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
