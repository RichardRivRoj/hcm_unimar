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

const HorizontalBarChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.type_name),
        datasets: [{
            label: 'Programas Activos',
            data: data.map(item => item.count),
            backgroundColor: '#004B9A',
            borderColor: '#003A7A',
            borderWidth: 1
        }]
    };

    const options = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.x} programas` } }
        },
        scales: {
            x: { beginAtZero: true },
            y: { grid: { display: false } }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default HorizontalBarChart