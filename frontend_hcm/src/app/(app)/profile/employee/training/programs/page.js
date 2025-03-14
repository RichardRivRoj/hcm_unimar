'use client'

import { Pagination, ProgramCard } from "@/components/ProgramCard"
import { useEmployeeTrainings } from "@/hooks/employee/useEmployeeTrainings"
import { useState } from "react"

const EmployeeTrainingList = () => {
    const [filters, setFilters] = useState({})
    const { public: publicData, enrolled, completed, error } = useEmployeeTrainings(filters)
  
    if (error) return <div className="p-8 text-red-500">Error al cargar los datos</div>
  
    return (
      <div className="min-h-screen p-8 ml-10 bg-gray-50">
        {/* Título principal */}
        <div className="mb-8 border-b-2 border-[#004b9a] pb-4">
          <h1 className="text-4xl font-bold text-[#004b9a]">Programas de Capacitación</h1>
          <p className="mt-2 text-gray-600">Explora y gestiona tus programas de formación</p>
        </div>
  
        {/* Filtros mejorados */}
        <div className="p-6 mb-8 bg-white shadow-md rounded-xl">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#004b9a] mb-1">Filtrar por fecha</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="MM (Mes)"
                  className="p-3 border-2 border-[#004b9a]/20 rounded-lg focus:border-[#004b9a] focus:ring-2 focus:ring-[#004b9a]/30 transition-all w-32"
                  onChange={e => setFilters({...filters, month: e.target.value})} 
                />
                <input
                  type="number"
                  placeholder="AAAA (Año)"
                  className="p-3 border-2 border-[#004b9a]/20 rounded-lg focus:border-[#004b9a] focus:ring-2 focus:ring-[#004b9a]/30 transition-all w-32"
                  onChange={e => setFilters({...filters, year: e.target.value})} 
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#004b9a] mb-1">Tipo de programa</label>
              <select 
                className="w-full p-3 border-2 border-[#004b9a]/20 rounded-lg focus:border-[#004b9a] focus:ring-2 focus:ring-[#004b9a]/30 transition-all"
                onChange={e => setFilters({...filters, training_type_id: e.target.value})} 
              >
                <option value="">Todos los tipos</option>
                {/* Aquí deberías mapear los tipos reales */}
                <option value="1">Seminario</option>
                <option value="2">Webinar</option>
                <option value="3">Curso</option>
              </select>
            </div>
          </div>
        </div>
  
        {/* Sección Programas Públicos */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#004b9a]">Programas Disponibles</h2>
            <div className="flex items-center gap-2">
              <span className="bg-[#004b9a] text-white px-3 py-1 rounded-full text-sm">
                {publicData.pagination.total} disponibles
              </span>
            </div>
          </div>
          <div className="flex pb-4 ml-10 overflow-x-auto">
            <div className="flex space-x-6">
              {publicData.isLoading ? (
                <div>Cargando...</div>
              ) : (
                publicData.data.map(program => (
                  <ProgramCard key={program.name} program={program} type="public" />
                ))
              )}
            </div>
          </div>
          <Pagination pagination={publicData.pagination} setPage={publicData.setPage} />
        </section>
  
        {/* Sección Inscritos */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#004b9a]">Mis Inscripciones</h2>
            <span className="bg-[#004b9a] text-white px-3 py-1 rounded-full text-sm">
              {enrolled.pagination.total} inscritos
            </span>
          </div>
          <div className="flex pb-4 ml-10 overflow-x-auto ">
            <div className="flex space-x-6">
              {enrolled.data.map(program => (
                <ProgramCard key={program.name} program={program} type="enrolled" />
              ))}
            </div>
          </div>
          <Pagination pagination={enrolled.pagination} setPage={enrolled.setPage} />
        </section>
  
        {/* Sección Completados */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#004b9a]">Programas Completados</h2>
            <span className="bg-[#004b9a] text-white px-3 py-1 rounded-full text-sm">
              {completed.pagination.total} completados
            </span>
          </div>
          <div className="flex pb-4 ml-10 overflow-x-auto">
            <div className="flex space-x-6">
              {completed.data.length === 0 ? (
                <div className="p-6 text-center text-gray-500 bg-white w-96 rounded-xl">
                  No hay programas completados
                </div>
              ) : (
                completed.data.map(program => (
                  <ProgramCard key={program.name} program={program} type="completed" />
                ))
              )}
            </div>
          </div>
          <Pagination pagination={completed.pagination} setPage={completed.setPage} />
        </section>
      </div>
    )
  }

  export default EmployeeTrainingList


  