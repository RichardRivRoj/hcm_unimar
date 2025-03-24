import { Bar } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ScoreDistributionChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.range),
        datasets: [{
            label: 'Cantidad de Evaluaciones',
            data: data.map(item => item.count),
            backgroundColor: '#004B9A',
            borderColor: '#003A7A',
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.parsed.y} evaluaciones`
                }
            }
        },
        scales: {
            y: { beginAtZero: true },
            x: { grid: { display: false } }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default ScoreDistributionChart;