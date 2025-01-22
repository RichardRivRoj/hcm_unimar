'use client';

import { useEffect, useState } from 'react';

const Evaluations = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [evaluations, setEvaluations] = useState({
        psychological: '',
        medical: '',
        administrative: '',
    });

    useEffect(() => {
        // Obtener candidatos que pasaron la entrevista
        const storedCandidates = JSON.parse(localStorage.getItem('interviewedCandidates') || '[]');
        setCandidates(storedCandidates);
    }, []);

    const handleEvaluationChange = (e) => {
        const { name, value } = e.target;
        setEvaluations((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveEvaluation = () => {
        if (!selectedCandidate) return alert('Por favor, selecciona un candidato.');

        const updatedCandidates = candidates.map((candidate) => {
            if (candidate.email === selectedCandidate.email) {
                return {
                    ...candidate,
                    evaluations,
                    status:
                        evaluations.psychological === 'apto' &&
                        evaluations.medical === 'apto' &&
                        evaluations.administrative === 'apto'
                            ? 'apto'
                            : 'no apto',
                };
            }
            return candidate;
        });

        setCandidates(updatedCandidates);
        localStorage.setItem('interviewedCandidates', JSON.stringify(updatedCandidates));
        alert('Resultados de la evaluación guardados.');
        setEvaluations({ psychological: '', medical: '', administrative: '' });
        setSelectedCandidate(null);
    };

    return (
        <div className="container p-8 mx-auto">
            <h1 className="mb-6 text-2xl font-bold">Gestión de Evaluaciones</h1>

            {/* Formulario para cargar resultados */}
            <div className="p-4 mb-8 rounded shadow bg-gray-50">
                <h2 className="mb-4 text-xl font-semibold">Cargar Resultados de Evaluación</h2>
                <div className="space-y-4">
                    {/* Selección de candidato */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Seleccionar Candidato
                        </label>
                        <select
                            value={selectedCandidate?.email || ''}
                            onChange={(e) => {
                                const candidate = candidates.find(
                                    (cand) => cand.email === e.target.value
                                );
                                setSelectedCandidate(candidate);
                            }}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="">Selecciona un candidato</option>
                            {candidates.map((candidate) => (
                                <option key={candidate.email} value={candidate.email}>
                                    {candidate.name} - {candidate.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Evaluación psicológica */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Evaluación Psicológica
                        </label>
                        <select
                            name="psychological"
                            value={evaluations.psychological}
                            onChange={handleEvaluationChange}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="">Seleccionar</option>
                            <option value="apto">Apto</option>
                            <option value="no apto">No Apto</option>
                        </select>
                    </div>

                    {/* Evaluación médica */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Evaluación Médica
                        </label>
                        <select
                            name="medical"
                            value={evaluations.medical}
                            onChange={handleEvaluationChange}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="">Seleccionar</option>
                            <option value="apto">Apto</option>
                            <option value="no apto">No Apto</option>
                        </select>
                    </div>

                    {/* Evaluación administrativa */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Evaluación Administrativa
                        </label>
                        <select
                            name="administrative"
                            value={evaluations.administrative}
                            onChange={handleEvaluationChange}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="">Seleccionar</option>
                            <option value="apto">Apto</option>
                            <option value="no apto">No Apto</option>
                        </select>
                    </div>

                    <button
                        onClick={handleSaveEvaluation}
                        className="px-4 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-700"
                    >
                        Guardar Evaluación
                    </button>
                </div>
            </div>

            {/* Resumen de evaluaciones */}
            <div className="p-4 rounded shadow bg-gray-50">
                <h2 className="mb-4 text-xl font-semibold">Resumen de Evaluaciones</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-sm font-medium tracking-wider text-left text-gray-500 uppercase">
                                Candidato
                            </th>
                            <th className="px-6 py-3 text-sm font-medium tracking-wider text-left text-gray-500 uppercase">
                                Psicológica
                            </th>
                            <th className="px-6 py-3 text-sm font-medium tracking-wider text-left text-gray-500 uppercase">
                                Médica
                            </th>
                            <th className="px-6 py-3 text-sm font-medium tracking-wider text-left text-gray-500 uppercase">
                                Administrativa
                            </th>
                            <th className="px-6 py-3 text-sm font-medium tracking-wider text-left text-gray-500 uppercase">
                                Estado
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {candidates.map((candidate, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4">{candidate.name}</td>
                                <td className="px-6 py-4">
                                    {candidate.evaluations?.psychological || 'Pendiente'}
                                </td>
                                <td className="px-6 py-4">
                                    {candidate.evaluations?.medical || 'Pendiente'}
                                </td>
                                <td className="px-6 py-4">
                                    {candidate.evaluations?.administrative || 'Pendiente'}
                                </td>
                                <td className="px-6 py-4">
                                    {candidate.status || 'En Proceso'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Evaluations;
