'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import StandardTable from '@/components/StandardTable';
import useFormEvaluations from '@/hooks/supervisor/useFormEvaluation';
import StandardLoader from '@/components/StandardLoader';

const EvaluationPage = () => {
    const router = useRouter();
    const {
        evaluationsList: data,
        loading,
        error,
        pagination,
        periods,
        handlePageChange,
        handleFilterChange,
        filters,
        fetchEvaluations
    } = useFormEvaluations();

    // Estado para el debounce del buscador
    const [searchInput, setSearchInput] = useState('');
    
    // Efecto para debounce del campo de búsqueda
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            handleFilterChange({
                target: {
                    name: 'search',
                    value: searchInput
                }
            });
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchInput]);

    const columns = [
        { header: 'Nombre Completo', accessor: 'full_name' },
        { header: 'Identificación', accessor: 'identification' },
        { header: 'Cargo', accessor: 'position' },
        { header: 'Puntaje Total', accessor: 'total_score' },
        { header: 'Periodo', accessor: 'period' },
        { header: 'Fecha Evaluación', accessor: 'evaluation_date' }
    ];

    const actions = [
        {
            icon: <Eye size={20} className="hover:text-blue-700" />,
            color: 'text-blue-600',
            handler: item => router.push(`/profile/supervisor/evaluation/list-forms/inspect/${item.evaluation_id}`)
        }
    ];

    const filtersConfig = [
        {
            name: 'period',
            value: filters.period,
            placeholder: 'Todos los periodos',
            options: periods.map(period => ({
                value: period.id,
                label: period.name
            }))
        }
    ];
;
    if (loading) return <StandardLoader />

    return (
        <div className="container p-4 mx-auto">
            <div className="p-4 mb-4 space-y-4">
                
                <div className="flex flex-col gap-4 md:flex-row">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, identificación o cargo"
                        className="w-full p-2 rounded md:max-w-lg"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>
            </div>

            <StandardTable
                title="Listado de Evaluaciones"
                columns={columns}
                data={data}
                filters={filtersConfig}
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                onFilterChange={handleFilterChange}
                actions={actions}
                loading={loading}
            />

            {error && (
                <div className="p-4 mt-4 text-red-700 bg-red-100 rounded-lg">
                    Error: {error}
                </div>
            )}
        </div>
    );
};

export default EvaluationPage;