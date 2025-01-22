// app/profile/admin/recruitment/interviews/calendario.jsx
'use client';

import { useEffect, useState } from 'react';

const CalendarioEntrevistas = () => {
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        const storedInterviews = JSON.parse(localStorage.getItem('interviews') || '[]');
        setInterviews(storedInterviews);
    }, []);

    return (
        <div className="p-4">
            <h2 className="mb-4 text-xl font-bold">Calendario de Entrevistas</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {interviews.map((interview, index) => (
                    <div
                        key={index}
                        className="p-4 text-gray-700 border rounded shadow bg-gray-50"
                    >
                        <p className="font-semibold">Candidato: {interview.candidate.name}</p>
                        <p>Fecha: {interview.date}</p>
                        <p>Hora: {interview.time}</p>
                        <p>Lugar: {interview.location}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarioEntrevistas;
