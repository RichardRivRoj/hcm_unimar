// app/profile/admin/recruitment/interviews/notes/page.jsx
'use client';

import { useState, useEffect } from 'react';

const InterviewsNotes = () => {
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        // Obtener las entrevistas desde localStorage
        const storedInterviews = JSON.parse(localStorage.getItem('interviews') || '[]');
        setInterviews(storedInterviews);
    }, []);

    const handleSaveNotes = (index, notes) => {
        const updatedInterviews = [...interviews];
        updatedInterviews[index].notes = notes;
        setInterviews(updatedInterviews);
        localStorage.setItem('interviews', JSON.stringify(updatedInterviews));
    };

    return (
        <div className="container p-8 mx-auto">
            <h1 className="mb-6 text-2xl font-bold">Entrevistas Programadas</h1>

            {interviews.map((interview, index) => (
                <div key={index} className="p-4 mb-4 rounded shadow bg-gray-50">
                    <h2 className="mb-2 text-xl font-semibold">{interview.candidate.name}</h2>
                    <p className="text-sm text-gray-700">Correo: {interview.candidate.email}</p>
                    <p className="text-sm text-gray-700">Fecha: {interview.date}</p>
                    <p className="text-sm text-gray-700">Hora: {interview.time}</p>
                    <p className="text-sm text-gray-700">Lugar: {interview.location}</p>

                    <textarea
                        className="block w-full mt-4 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Notas de la entrevista..."
                        defaultValue={interview.notes || ''}
                        onBlur={(e) => handleSaveNotes(index, e.target.value)}
                    />
                </div>
            ))}
        </div>
    );
};

export default InterviewsNotes;
