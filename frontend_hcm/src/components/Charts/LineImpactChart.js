import { Line } from 'react-chartjs-2'
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const LineImpactChart = ({ data }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`
                }
            }
        },
        scales: {
            y: { 
                beginAtZero: true,
                max: 100,
                title: { display: true, text: 'Puntuación Promedio' }
            },
            x: { 
                grid: { display: false },
                title: { display: true, text: 'Periodo' }
            }
        }
    }

    return <Line data={data} options={options} />
}

export default LineImpactChart