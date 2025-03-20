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
        {documents.map(document => {
          // Verifica si el documento es de tipo "Cuentas de banco"
          const isBankAccount = document.banco && document.numero_cuenta;

          return (
            <div
              key={document.id}
              onClick={() => onDocumentSelect(document)}
              className="p-4 transition-shadow bg-white rounded-lg cursor-pointer hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  {/* Muestra el nombre si no es una cuenta de banco */}
                  {!isBankAccount && document.nombre && (
                    <h3 className="font-semibold">{document.nombre}</h3>
                  )}

                  {/* Muestra los datos de la cuenta de banco si es el caso */}
                  {isBankAccount && (
                    <>
                      <h3 className="font-semibold">
                        {document.banco} - {document.tipo_cuenta}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Número de cuenta: {document.numero_cuenta}
                      </p>
                      {document.moneda && (
                        <p className="text-sm text-gray-500">
                          Moneda: {document.moneda}
                        </p>
                      )}
                    </>
                  )}

                  {/* Muestra la fecha de emisión si está disponible */}
                  {document.fecha_emision && (
                    <p className="text-sm text-gray-500">
                      Emisión: {new Date(document.fecha_emision).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Muestra la extensión del archivo si está disponible */}
                {document.archivo && (
                  <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                    {document.archivo.split('.').pop().toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Paginación */}
      {pagination.totalPages >= 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          className="mt-6"
        />
      )}
    </div>
  );
}