import { Bar } from 'react-chartjs-2'

const AverageHiringTimeChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.department),
    datasets: [
      {
        label: 'Días promedio',
        data: data.map(item => parseFloat(item.average_days)),
        backgroundColor: '#004b9a', // Color de las barras
        borderColor: '#003a7a', // Borde de las barras
        borderWidth: 1,
        borderRadius: 8, // Bordes redondeados
      }
    ]
  }

  const options = {
    indexAxis: 'y', // Hace que las barras sean horizontales
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Días'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)', // Color de la cuadrícula en el eje X
        },
      },
      y: {
        grid: {
          display: false, // Ocultar cuadrícula en el eje Y
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'y',
      intersect: false,
    },
  }

  return <Bar data={chartData} options={options} />
}

export default AverageHiringTimeChart