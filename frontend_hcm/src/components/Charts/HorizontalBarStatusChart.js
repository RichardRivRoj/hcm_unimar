// components/Charts/HorizontalBarStatusChart.js
'use client'

import { Bar } from 'react-chartjs-2'

const HorizontalBarStatusChart = ({ data }) => {
  const statusColors = {
    'Activo': '#004b9a',
    'Inactivo': '#3b82f6',
    'En pausa': '#60a5fa'
  }

  const chartData = {
    labels: data.map(item => item.status_name),
    datasets: [{
      label: 'Vacantes',
      data: data.map(item => item.total),
      backgroundColor: data.map(item => statusColors[item.status_name] || '#94a3b8'),
      borderWidth: 0,
      borderRadius: 4
    }]
  }

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }

  return <Bar data={chartData} options={options} />
}

export default HorizontalBarStatusChart