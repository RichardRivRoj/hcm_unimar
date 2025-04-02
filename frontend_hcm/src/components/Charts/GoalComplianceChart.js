// components/Charts/GoalComplianceChart.js
'use client'

import { Bar } from 'react-chartjs-2'

const GoalComplianceChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.position),
        datasets: [
            {
                label: 'Tasa de Cumplimiento',
                data: data.map(item => item.compliance_rate),
                backgroundColor: '#004b9a',
                borderWidth: 0
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Importante
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Porcentaje'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Puestos'
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
                        const dataItem = data[context.dataIndex]
                        return `${dataItem.position}: ${dataItem.compliance_rate}% (${dataItem.compliant}/${dataItem.total_evaluations})`
                    }
                }
            }
        }
    }

    return (
        <div className="h-96"> {/* Contenedor con altura fija */}
            <Bar data={chartData} options={options} />
        </div>
    )
}

export default GoalComplianceChart