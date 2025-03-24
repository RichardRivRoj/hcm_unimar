import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip, 
    Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const StackedBarChart = ({ data }) => {
    // Paleta corporativa con variaciones
    const corporateColors = [
        '#004B9A', // Azul primario
        '#B0BEC5', // Gris corporativo
        '#003A7A', // Azul oscuro (variación)
        '#8C9CA3'  // Gris oscuro (variación)
    ]

    const chartData = {
        labels: ['Estados de Finalización'],
        datasets: data.map((status, index) => ({
            label: status.status_name,
            data: [status.count],
            backgroundColor: corporateColors[index % corporateColors.length],
            borderColor: '#ffffff',
            borderWidth: 1
        })),
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    padding: 20
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b)
                        const percentage = ((context.raw / total) * 100).toFixed(1) + '%'
                        return `${context.dataset.label}: ${context.raw} (${percentage})`
                    }
                }
            }
        },
        scales: {
            x: { 
                stacked: true,
                grid: { display: false }
            },
            y: { 
                stacked: true,
                ticks: { beginAtZero: true }
            }
        }
    }

    return <Bar data={chartData} options={options} />
}

export default StackedBarChart
