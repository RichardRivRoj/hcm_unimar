import { useState } from 'react'
import useContracts from '@/hooks/useContracts'
import { Skeleton } from '@/components/skeleton'
import { Alert, AlertDescription } from '@/components/alert'
import Modal from '@/components/Modal'

const ContractDocuments = () => {
    const {
        contracts,
        personal_info,
        salary_info,
        loading,
        error,
        meta,
        refresh,
        currentPage,
        totalPages,
        goToNextPage,
        goToPrevPage
    } = useContracts()
    const [selectedContract, setSelectedContract] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Generador de texto de contrato con datos interpolados
    const generateContractText = (contract, personalInfo, salaryInfo) => {
        if (!contract || !personalInfo || !salaryInfo) return ''
    
        return `
        CONTRATO LABORAL N° ${contract.contract_number}

        **ENTRE:**

        **${process.env.NEXT_PUBLIC_COMPANY_NAME?.toUpperCase() || '[NOMBRE DE LA EMPRESA]'}**, 
        con domicilio legal en ${process.env.NEXT_PUBLIC_COMPANY_ADDRESS?.toUpperCase() || '[DIRECCIÓN DE LA EMPRESA]'}, 

        **Y**

        **${personal_info?.full_name?.toUpperCase() || '[NOMBRE DEL TRABAJADOR]'}**, 
        portador de la cédula de identidad N° ${personal_info?.identification || '[NÚMERO DE IDENTIFICACIÓN]'}, 
        domiciliado en ${personal_info?.country?.toUpperCase() || '[DIRECCIÓN DEL TRABAJADOR]'}.

        **CLÁUSULA PRIMERA - OBJETO DEL CONTRATO**
        El trabajador será contratado para desempeñar el puesto de **${personal_info?.position?.toUpperCase() || '[PUESTO]'}** 
        en el departamento de **${personal_info?.department?.toUpperCase() || '[DEPARTAMENTO]'}**.

        **CLÁUSULA SEGUNDA - DURACIÓN**
        El presente contrato tendrá una duración de carácter **${contract.type?.toUpperCase() || '[TIPO DE CONTRATO]'}**, 
        con inicio el **${contract.start_date}** y ${
            contract.end_date !== 'Indefinido'
                ? `vencimiento el **${contract.end_date}**`
                : '**DURACIÓN INDEFINIDA**'
            }.

        **CLÁUSULA TERCERA - REMUNERACIÓN**
        El trabajador percibirá una remuneración mensual de:
        **${salary_info?.amount ? `${salary_info.amount} ${salary_info?.currency}` : '[MONTO]'}**

        Desglose:
        - Sueldo base: ${salary_info?.amount ? (salary_info.amount * 0.8).toFixed(2) : '[MONTO]'} ${salary_info?.currency}
        - Bonificaciones: ${salary_info?.amount ? (salary_info.amount * 0.15).toFixed(2) : '[MONTO]'} ${salary_info?.currency}
        - Beneficios adicionales: ${salary_info?.amount ? (salary_info.amount * 0.05).toFixed(2) : '[MONTO]'} ${salary_info?.currency}

        **CLÁUSULA CUARTA - HORARIO**
        La jornada laboral será de 8 horas semanales, distribuidas de lunes a viernes en el horario de 8:00 AM a 5:00 PM.

        **CLÁUSULA QUINTA - OBLIGACIONES**
        El trabajador se compromete a:
        1. Cumplir con las funciones descritas en el manual de puesto
        2. Respetar los reglamentos internos de la empresa
        3. Mantener confidencialidad sobre información sensible

        **CLÁUSULA SEXTA - TERMINACIÓN**
        El presente contrato podrá ser terminado por:
        - Mutuo acuerdo
        - Renuncia voluntaria
        - Incumplimiento grave de obligaciones

        **ESTADO ACTUAL:** **${contract.status?.toUpperCase() || '[ESTADO]'}**

        En señal de conformidad, se firma el presente contrato en dos ejemplares de igual tenor.

        ___________________________
        Firma del Representante Legal

        ___________________________
        Firma del Trabajador
        **${personal_info?.full_name?.toUpperCase() || '[NOMBRE DEL TRABAJADOR]'}**

        Fecha: [FECHA DE FIRMA]
        Lugar: [LUGAR DE FIRMA]
    `}

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-4">
            <Modal
                isOpen={!!selectedContract}
                onClose={() => setSelectedContract(null)}
                maxWidth="2xl"
            >
                {selectedContract && personal_info && salary_info && (
                    <div className="p-6 bg-white rounded-lg max-h-[80vh] overflow-y-auto scrollbar-none">
                        <h2 className="mb-4 text-2xl font-bold text-center">
                            Contrato {selectedContract.contract_number}
                        </h2>

                        <div className="space-y-4 font-mono text-sm text-justify whitespace-pre-line">
                            {generateContractText(selectedContract, personal_info, salary_info)
                                .split('\n')
                                .map((line, index) => (
                                    <p key={index} className={
                                        line.startsWith('**') 
                                            ? 'font-bold text-gray-900'
                                            : 'text-gray-700'
                                    }>
                                        {line.replace(/\*\*/g, '')}
                                    </p>
                                ))}
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setSelectedContract(null)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
                            >
                                Cerrar
                            </button>
                            {selectedContract.file_url && (
                                <a
                                    href={selectedContract.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 text-white bg-blue-600 rounded-lg"
                                >
                                    Descargar PDF
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Contratos</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => refresh(currentPage)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        disabled={loading}
                    >
                        {loading ? 'Actualizando...' : '⟳ Actualizar'}
                    </button>
                </div>
            </div>
            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <Skeleton key={i} className="w-full h-32 rounded-lg" />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2">
                        {contracts?.map(contract => (
                            <div
                                key={contract.id}
                                onClick={() => setSelectedContract(contract)}
                                className="p-4 bg-white border rounded-lg cursor-pointer hover:shadow-md"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold">
                                        {contract.contract_number}
                                    </h3>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        contract.status === 'Activo'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {contract.status}
                                    </span>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p><strong>Tipo:</strong> {contract.type}</p>
                                    <p><strong>Inicio:</strong> {contract.start_date}</p>
                                    <p><strong>Fin:</strong> {contract.end_date || 'Indefinido'}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1 || loading}
                            className="px-4 py-2 text-white bg-blue-500 rounded-lg disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        
                        <div className="text-sm text-gray-600">
                            Página {currentPage} de {totalPages}
                        </div>
                        
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages || loading}
                            className="px-4 py-2 text-white bg-blue-500 rounded-lg disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default ContractDocuments
