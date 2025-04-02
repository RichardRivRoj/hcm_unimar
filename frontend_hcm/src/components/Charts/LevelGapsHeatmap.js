'use client'

import Plot from 'react-plotly.js'

const LevelGapsHeatmap = ({ data, levels, departments }) => {
    // 1. Validación de datos crítica
    if (!data || !levels?.length || !departments?.length) {
        return <div className="p-4 text-gray-500">Cargando datos del heatmap...</div>
    }

    const preparePlotData = () => {
        // 2. Asegurar el orden consistente de departamentos y niveles
        const orderedDepts = departments.map(d => d.name)
        const orderedLevels = levels.map(l => l.name)

        // 3. Crear matriz z con dimensiones correctas
        const z = Array(orderedDepts.length).fill().map(() => 
            Array(orderedLevels.length).fill(0))
        
        // 4. Mapeo seguro de valores
        data.forEach(deptData => {
            const deptIndex = orderedDepts.indexOf(deptData.department)
            if (deptIndex === -1) return
            
            Object.entries(deptData.levels).forEach(([levelId, score]) => {
                const level = levels.find(l => l.id === parseInt(levelId))
                if (!level) return
                
                const levelIndex = orderedLevels.indexOf(level.name)
                if (levelIndex !== -1) {
                    z[deptIndex][levelIndex] = Number(score) || 0
                }
            })
        })

        return [{
            z,
            x: orderedLevels,
            y: orderedDepts,
            type: 'heatmap',
            colorscale: 'Viridis',
            hoverongaps: false,
            zmin: 0,  // 5. Forzar escala mínima
            zmax: 100, //    y máxima consistente
            colorbar: {
                title: 'Puntuación',
                titleside: 'right',
            },
        }]
    }

    // 6. Chequear integridad de la matriz z
    const plotData = preparePlotData()
    const isValid = plotData[0].z.every(row => 
        row.length === levels.length && 
        row.every(cell => typeof cell === 'number'))
    
    if (!isValid) {
        return <div className="p-4 text-red-500"> {'Error en formato de datos'} </div>
    }

    return (
        <Plot
            data={plotData}
            layout={{
                title: 'Desempeño por Nivel y Departamento',
                margin: { t: 40, l: 10, r: 20, b: 40 }, // Más margen para etiquetas
                xaxis: {
                    title: 'Niveles Jerárquicos',
                    tickangle: -4,
                    automargin: true, // Autoajuste de margen
                    type: 'category' // 7. Forzar tipo categórico
                },
                yaxis: {
                    title: 'Departamentos',
                    automargin: true,
                    type: 'category'
                },
                height: 200 + (departments.length * 10), // Altura dinámica
                plot_bgcolor: '#f8fafc',
                paper_bgcolor: '#ffffff',
                font: {
                    family: 'Inter, sans-serif',
                    color: '#1e293b',
                },
                hoverlabel: {
                    bgcolor: '#ffffff',
                    bordercolor: '#e2e8f0',
                    font: {
                        color: '#1e293b',
                    },
                },
                height: 200,
            }}
            config={{
                responsive: true,
                displayModeBar: false,
                scrollZoom: false,
            }}
            className="w-full p-2 rounded-lg shadow-sm"
        />
    )
}

export default LevelGapsHeatmap