'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAgendas from '@/hooks/useAgendas';
import useTypeAgendas from '@/hooks/typeAgendasView';
import useStatuses from '@/hooks/useStatuses';
import { Eye } from 'lucide-react';
import StandardLoader from '@/components/StandardLoader';
import StandardTable from '@/components/StandardTable';

const CandidateAgendas = ({ params }) => {
    const { candidateId } = params;
    const router = useRouter();

    const [filters, setFilters] = useState({
        type_agenda: '',
        status: '',
        page: 1,
    });

    const { agendas, loading, meta, error } = useAgendas(candidateId, filters);
    const { typeAgendas } = useTypeAgendas();
    const { statuses } = useStatuses();

    // Configuración de columnas para StandardTable
    const columns = [
        {
            header: 'Fecha',
            accessor: 'scheduled_date',
            render: (item) => new Date(item.scheduled_date).toLocaleDateString('es-ES', { timeZone: 'UTC' })
        },
        {
            header: 'Hora',
            accessor: 'formatted_time'
        },
        {
            header: 'Tipo de evento',
            accessor: 'typeagenda.name',
            render: (item) => `${item.typeagenda.name}`
        },
        {
            header: 'Ubicación',
            accessor: 'location'
        },
        {
            header: 'Estado',
            accessor: 'status.name',
            render: (item) => `${item.status.name}`
        }
    ];

    // Configuración de filtros para StandardTable
    const tableFilters = [
        {
            type: 'select',
            name: 'type_agenda',
            placeholder: 'Seleccione Tipo de Evento',
            options: (typeAgendas || []).map(type => ({
                value: type.id,
                label: type.name
            }))
        },
        {
            type: 'select',
            name: 'status',
            placeholder: 'Seleccione estatus',
            options: (statuses || []).map(status => ({
                value: status.id,
                label: status.name
            }))
        }
    ];

    // Acciones para la tabla
    const actions = [
        {
            icon: <Eye size={20} className="text-[#004b9a]" />,
            color: 'text-[#004b9a] hover:bg-[#004b9a]/10',
            handler: (item) => router.push(
                `/profile/admin/recruitment/interviews/agendas/${item.id}`
            )
        }
    ];

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    if (loading) return <StandardLoader />

    if (error) {
        return <div className="p-6 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="max-w-full p-6 mx-auto mt-6 ml-6 overflow-hidden">
            <button
                onClick={() => router.back()}
                className="flex items-center text-[#004b9a] hover:text-[#003a7d] transition-colors duration-200 w-fit mb-6"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                <span className="font-semibold">Volver</span>
            </button>

            <StandardTable
                title="Eventos Agendados"
                columns={columns}
                data={agendas}
                filters={tableFilters}
                currentPage={meta?.current_page || 1}
                totalPages={meta?.last_page || 1}
                totalItems={meta?.total}
                onPageChange={handlePageChange}
                onFilterChange={handleFilterChange}
                actions={actions}
                loading={loading}
            />
        </div>
    );
};

export default CandidateAgendas;