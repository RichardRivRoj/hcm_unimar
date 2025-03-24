'use client'

import Plot from 'react-plotly.js'

const LevelGapsHeatmap = ({ data, levels, departments }) => {
    const preparePlotData = () => {
        const z = []
        const x = levels.map(level => level.name)
        const y = departments.map(dept => dept.name)

        departments.forEach(dept => {
            const row = []
            levels.forEach(level => {
                const score =
                    data.find(d => d.department === dept.name)?.levels[
                        level.id
                    ] || 0
                row.push(score)
            })
            z.push(row)
        })

        return [
            {
                z,
                x,
                y,
                type: 'heatmap',
                colorscale: 'Viridis',
                hoverongaps: false,
                colorbar: {
                    title: 'Puntuación',
                    titleside: 'right',
                },
            },
        ]
    }

    return (
        <Plot
            data={preparePlotData()}
            layout={{
                title: 'Desempeño por Nivel y Departamento',
                margin: { t: 40, l: 15 },
                xaxis: {
                    title: 'Niveles Jerárquicos',
                    tickangle: -4,
                },
                yaxis: {
                    title: 'Departamentos',
                    automargin: true,
                },
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
