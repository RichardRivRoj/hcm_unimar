'use client'

import Pagination from '@/components/Pagination'

export default function DocumentCategory({
  documents,
  title,
  onDocumentSelect,
  pagination,
  onPageChange
}) {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">{title}</h2>
      
      <div className="space-y-4">
        {documents.map(document => (
          <div
            key={document.id}
            onClick={() => onDocumentSelect(document)}
            className="p-4 transition-shadow bg-white rounded-lg cursor-pointer hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{document.nombre}</h3>
                {document.fecha_emision && (
                  <p className="text-sm text-gray-500">
                    Emisión: {new Date(document.fecha_emision).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                {document.archivo?.split('.').pop().toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {pagination.totalPages >= 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          className="mt-6"
        />
      )}
    </div>
  )
}