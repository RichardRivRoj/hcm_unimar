'use client'

import { Scatter } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import ChartCard from '../Dashboard/ChartCard'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)

const PerformanceScatterChart = ({ data, correlation }) => {
  const chartData = {
    datasets: [
      {
        label: 'Desempeño vs Antigüedad',
        data: data.map(item => ({
          x: item.tenure,
          y: item.score,
          employee: item.employee
        })),
        backgroundColor: '#004b9a',
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Antigüedad (años)',
          color: '#374151',
          font: {
            weight: '600'
          }
        },
        grid: {
          color: '#f3f4f6'
        }
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Puntuación',
          color: '#374151',
          font: {
            weight: '600'
          }
        },
        max: 100,
        grid: {
          color: '#f3f4f6'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const data = context.raw
            return `${data.employee}: ${data.y} pts (${data.x} años)`
          }
        }
      },
      subtitle: {
        display: true,
        text: `Coeficiente de correlación: ${correlation.toFixed(2)}`,
        position: 'bottom',
        align: 'start',
        font: {
          size: 14,
          style: 'italic'
        },
        padding: {
          bottom: 10
        }
      }
    }
  }

  return (
    <ChartCard title="Relación Desempeño vs Antigüedad">
      <Scatter data={chartData} options={options} />
    </ChartCard>
  )
}

export default PerformanceScatterChart