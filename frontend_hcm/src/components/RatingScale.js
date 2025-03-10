'use client'
import React from 'react'

const RatingScale = () => {
    const rating_scale = [
        { score: 5, label: 'Excelente' },
        { score: 4, label: 'Bueno' },
        { score: 3, label: 'Regular' },
        { score: 2, label: 'Muy Deficiente' },
        { score: 1, label: 'Deficiente' }
    ]

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-[#004b9a]/20">
            <h3 className="text-lg font-semibold text-[#004b9a] mb-3">
                Escala de Calificación
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium text-[#004b9a] border-b-2 border-[#004b9a] pb-1">
                    Puntuación
                </div>
                <div className="font-medium text-[#004b9a] border-b-2 border-[#004b9a] pb-1">
                    Nivel
                </div>

                {rating_scale.map((item) => (
                    <React.Fragment key={item.score}>
                        <div className="p-1 text-center font-medium text-[#004b9a]">
                            {item.score}
                        </div>
                        <div className="p-1 text-gray-700">
                            {item.label}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

export default RatingScale