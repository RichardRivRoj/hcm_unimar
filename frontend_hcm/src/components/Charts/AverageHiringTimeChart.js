import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const AverageHiringTimeChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.department),
    datasets: [
      {
        label: 'Días promedio',
        data: data.map(item => parseFloat(item.average_days)),
        backgroundColor: '#004b9a',
        borderColor: '#003a7a',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tiempo Promedio de Contratación por Departamento',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Días'
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default AverageHiringTimeChart;