// components/Charts/TrainingParticipationChart.js
'use client'

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const TrainingParticipationChart = ({ data }) => {
  const chartData = {
    labels: ['Inscritos', 'No Inscritos'],
    datasets: [
      {
        data: [
          data.enrolled,
          data.total_employees - data.enrolled
        ],
        backgroundColor: ['#004B9A', '#B0BEC5'],
        borderWidth: 0,
      }
    ]
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
            const value = context.parsed
            const percentage = ((value / total) * 100).toFixed(1) + '%'
            return `${context.label}: ${value} (${percentage})`
          }
        }
      }
    }
  }

  return <Doughnut data={chartData} options={options} />
}

export default TrainingParticipationChart