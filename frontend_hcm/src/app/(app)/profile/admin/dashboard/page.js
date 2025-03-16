'use client'

import { useState } from 'react'
import { ChartPieIcon, UserGroupIcon, AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline'
import DashboardTab from '@/components/Dashboard/DashboardTab'
import RecruitmentDashboard from './RecruitmentDashboard'
import PerformanceDashboard from './PerformanceDashboard'
import TrainingDashboard from './TrainingDashboard'
import PersonnelDashboard from './PersonnelDashboard'

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('recruitment')

  const tabs = [
    {
      id: 'recruitment',
      label: 'Reclutamiento y Selección',
      icon: <UserGroupIcon className="w-5 h-5" />
    },
    {
      id: 'performance',
      label: 'Evaluación de Desempeño',
      icon: <ChartPieIcon className="w-5 h-5" />
    },
    {
      id: 'training',
      label: 'Capacitación y Desarrollo',
      icon: <AcademicCapIcon className="w-5 h-5" />
    },
    {
      id: 'personnel',
      label: 'Gestión del Personal',
      icon: <BriefcaseIcon className="w-5 h-5" />
    }
  ]

  return (
    <div className="min-h-screen p-6 ml-10 bg-gray-50">
      <div className="mx-auto space-y-8 max-w-7xl">
        {/* Header y Navegación */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#004b9a]">Dashboard de Gestión HR</h1>
          
          {/* Navegación por pestañas */}
          <nav className="flex space-x-4 border-b border-gray-200">
            {tabs.map((tab) => (
              <DashboardTab
                key={tab.id}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                icon={tab.icon}
              >
                {tab.label}
              </DashboardTab>
            ))}
          </nav>
        </div>

        {/* Contenido dinámico */}
        <div className="dashboard-content">
          {activeTab === 'recruitment' && <RecruitmentDashboard />}
          {activeTab === 'performance' && <PerformanceDashboard />}
          {activeTab === 'training' && <TrainingDashboard />}
          {activeTab === 'personnel' && <PersonnelDashboard />}
        </div>
      </div>
    </div>
  )
}

export default MainDashboard
