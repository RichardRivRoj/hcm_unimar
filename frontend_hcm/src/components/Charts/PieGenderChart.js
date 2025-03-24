// components/Charts/PieGenderChart.js
'use client'

import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'

const PieGenderChart = ({ data }) => {
  const genderColors = {
    'Masculino': '#004b9a',
    'Femenino': '#3b82f6',
    'Otro': '#60a5fa'
  }

  const chartData = {
    labels: data.map(item => item.gender),
    datasets: [{
      data: data.map(item => item.total),
      backgroundColor: data.map(item => genderColors[item.gender] || '#94a3b8'),
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

  return <Pie data={chartData} options={options} />
}

export default PieGenderChart