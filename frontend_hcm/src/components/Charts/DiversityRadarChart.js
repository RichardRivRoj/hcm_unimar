// components/Charts/DiversityRadarChart.js
'use client'

import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const DiversityRadarChart = ({ data }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                pointLabels: {
                    font: {
                        size: 12
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: 'top'
            }
        }
    };

    return (
        <div className="h-96">
            <Radar data={data} options={options} />
        </div>
    );
};

export default DiversityRadarChart;