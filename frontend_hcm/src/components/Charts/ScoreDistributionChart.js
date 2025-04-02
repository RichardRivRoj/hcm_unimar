import { Bar } from "react-chartjs-2"

const ScoreDistributionChart = ({ data }) => {
    // Asegurar el orden correcto de los rangos
    const orderedRanges = ['0-20', '21-40', '41-60', '61-80', '81-100']
    
    // Mapear datos y llenar vacíos
    const chartData = {
        labels: orderedRanges,
        datasets: [{
            label: 'Cantidad de Evaluaciones',
            data: orderedRanges.map(range => {
                const found = data.find(item => item.score_range === range)
                return found ? found.count : 0
            }),
            backgroundColor: '#004B9A',
            borderColor: '#003A7A',
            borderWidth: 1
        }]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Añadir esto
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.parsed.y} evaluaciones`
                }
            },
            title: { // Añadir título
                display: true,
                text: 'Distribución de Calificaciones',
                font: { size: 16 }
            }
        },
        scales: {
            y: { 
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Cantidad de Evaluaciones'
                }
            },
            x: { 
                grid: { display: false },
                title: {
                    display: true,
                    text: 'Rangos de Calificación'
                }
            }
        }
    }

    return <Bar data={chartData} options={options} />
}

export default ScoreDistributionChart