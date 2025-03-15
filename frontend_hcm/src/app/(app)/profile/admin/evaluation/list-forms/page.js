'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import StandardTable from '@/components/StandardTable';
import useFormEvaluationDepartments from '@/hooks/admin/useFormEvaluationDepartments';
import StandardLoader from '@/components/StandardLoader';

const EvaluationPage = () => {
    const router = useRouter();

    const {
        evaluationsList: data,
        loading,
        error,
        pagination,
        periods,
        departments,
        handlePageChange,
        handleFilterChange,
        filters,
        fetchEvaluationDepartments
    } = useFormEvaluationDepartments();
    

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
        { header: 'Departamento', accessor: 'department' },
        { header: 'Periodo', accessor: 'period' },
        { header: 'Fecha Evaluación', accessor: 'evaluation_date' }
    ];

    const actions = [
        {
            icon: <Eye size={20} className="hover:text-blue-700" />,
            color: 'text-blue-600',
            handler: item => router.push(`/profile/admin/evaluation/list-forms/inspect/${item.evaluation_id}`)
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
        },
        {
            name: 'department',
            value: filters.department,
            placeholder: 'Todos los departamentos',
            options: departments.map(department => ({
                value: department.id,
                label: department.name
            }))
        }
    ];

    if (loading) return <StandardLoader />

    return (
        <div className="container p-4 mx-auto">
            <div className="ml-6 space-y-4">
                
                <div className="flex flex-col gap-4 md:flex-row">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o identificación"
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