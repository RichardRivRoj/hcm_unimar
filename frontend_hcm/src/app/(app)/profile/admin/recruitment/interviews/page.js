'use client';

import { useState } from 'react';
import AgendarEntrevista from './Agendar'; // Componente para agendar entrevistas
import CalendarioEntrevistas from './Calendario'; // Componente del calendario
import InterviewsNotes from './Notas'; // Componente de notas

const Interviews = () => {
    const [activeTab, setActiveTab] = useState('agendar'); // Pestaña activa

    const renderContent = () => {
        switch (activeTab) {
            case 'agendar':
                return <AgendarEntrevista />;
            case 'calendario':
                return <CalendarioEntrevistas />;
            case 'notas':
                return <InterviewsNotes />;
            default:
                return <AgendarEntrevista />;
        }
    };

    return (
        <div className="container p-8 mx-auto">
            <h1 className="mb-6 text-2xl font-bold">Gestión de Entrevistas</h1>

            {/* Opciones de pestañas */}
            <div className="flex mb-6 space-x-4 border-b-2 border-gray-200">
                <button
                    onClick={() => setActiveTab('agendar')}
                    className={`px-4 py-2 font-medium ${
                        activeTab === 'agendar'
                            ? 'border-b-4 border-blue-600 text-blue-600'
                            : 'text-gray-600 hover:text-blue-600'
                    }`}
                >
                    Agendar Entrevista
                </button>
                <button
                    onClick={() => setActiveTab('calendario')}
                    className={`px-4 py-2 font-medium ${
                        activeTab === 'calendario'
                            ? 'border-b-4 border-blue-600 text-blue-600'
                            : 'text-gray-600 hover:text-blue-600'
                    }`}
                >
                    Calendario
                </button>
                <button
                    onClick={() => setActiveTab('notas')}
                    className={`px-4 py-2 font-medium ${
                        activeTab === 'notas'
                            ? 'border-b-4 border-blue-600 text-blue-600'
                            : 'text-gray-600 hover:text-blue-600'
                    }`}
                >
                    Notas
                </button>
            </div>

            {/* Contenido dinámico */}
            <div>{renderContent()}</div>
        </div>
    );
};

export default Interviews;

