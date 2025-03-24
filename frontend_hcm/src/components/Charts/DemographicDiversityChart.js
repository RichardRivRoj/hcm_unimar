'use client'

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const DemographicDiversityChart = ({ data, title }) => {
    const chartData = {
        labels: data.map(item => item.label),
        datasets: [{
            data: data.map(item => item.count),
            backgroundColor: [
                '#004B9A', '#B0BEC5', '#003A7A', '#8C9CA3', '#0056b3',
                '#c0ccd1', '#002851', '#66757f', '#001a3d', '#99a6ad'
            ],
            borderWidth: 0
        }]
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-semibold text-center">{title}</h3>
            <div className="relative h-64">
                <Doughnut 
                    data={chartData}
                    options={{ 
                        plugins: { legend: { position: 'bottom' } },
                        maintainAspectRatio: false
                    }}
                />
            </div>
        </div>
    )
}

export default DemographicDiversityChart