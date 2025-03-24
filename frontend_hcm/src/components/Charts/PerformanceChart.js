'use client'

import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'

const PerformanceChart = ({ data, departments }) => {
  // Mapear department_id a nombres
  const getDepartmentName = (id) => {
    return departments.find(d => d.id === id)?.name || 'Departamento desconocido'
  }

  const chartData = {
    labels: data.map(item => getDepartmentName(item.department_id)),
    datasets: [{
      label: 'Puntuación Promedio',
      data: data.map(item => parseFloat(item.average_score)),
      backgroundColor: '#004b9a',
      borderWidth: 1,
      borderRadius: 8
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: 'Puntuación (0-10)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Departamentos'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      }
    }
  }

  return <Bar data={chartData} options={options} />
}

export default PerformanceChart