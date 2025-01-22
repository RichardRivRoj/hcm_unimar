// app/profile/admin/recruitment/interviews/agendar.jsx
'use client';

import { useState, useEffect } from 'react';

const AgendarEntrevista = () => {
    const [applications, setApplications] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        location: '',
    });

    useEffect(() => {
        const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
        const acceptedApplications = storedApplications.filter(app => app.status === 'accepted');
        setApplications(acceptedApplications);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSchedule = (e) => {
        e.preventDefault();

        if (!selectedCandidate) return alert('Por favor, selecciona un candidato.');

        const storedInterviews = JSON.parse(localStorage.getItem('interviews') || '[]');
        const newInterview = {
            ...formData,
            candidate: selectedCandidate,
        };
        localStorage.setItem('interviews', JSON.stringify([...storedInterviews, newInterview]));
        alert(`Correo enviado a ${selectedCandidate.email} con detalles de la entrevista.`);
        setSelectedCandidate(null);
        setFormData({ date: '', time: '', location: '' });
    };

    return (
        <form onSubmit={handleSchedule} className="p-4 space-y-4 rounded shadow bg-gray-50">
            <h2 className="text-xl font-semibold">Formulario de Entrevista</h2>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Seleccionar Candidato
                </label>
                <select
                    value={selectedCandidate?.email || ''}
                    onChange={(e) => {
                        const candidate = applications.find(app => app.email === e.target.value);
                        setSelectedCandidate(candidate);
                    }}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                >
                    <option value="">Selecciona un candidato</option>
                    {applications.map((app) => (
                        <option key={app.email} value={app.email}>
                            {app.name} - {app.email}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Fecha</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Hora</label>
                <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Lugar</label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Ejemplo: Sala de reuniones A"
                    required
                />
            </div>
            <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-700"
            >
                Agendar Entrevista
            </button>
        </form>
    );
};

export default AgendarEntrevista;
