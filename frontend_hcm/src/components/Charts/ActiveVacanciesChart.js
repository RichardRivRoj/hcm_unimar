// components/Charts/ActiveVacanciesChart.js
'use client'

import { Doughnut } from 'react-chartjs-2'

const ActiveVacanciesChart = ({ data }) => {
  // Mapear datos a formato requerido
  const chartData = {
    labels: data.map(item => item.department?.name || 'Desconocido'),
    datasets: [{
      label: 'Vacantes Activas',
      data: data.map(item => item.total_active_vacancies),
      backgroundColor: [
        '#004b9a', // Color principal
        '#3b82f6', // Azul más claro
        '#60a5fa', // Variación de azul
        '#93c5fd'  // Tono más claro
      ],
      borderWidth: 0,
      hoverOffset: 20
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const value = context.parsed
            const percentage = ((value / total) * 100).toFixed(1)
            return `${context.label}: ${value} (${percentage}%)`
          }
        }
      }
    }
  }

  return <Doughnut data={chartData} options={options} />
}

export default ActiveVacanciesChart