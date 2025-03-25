'use client'
import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import annotationPlugin from 'chartjs-plugin-annotation'

// Registrar componentes necesarios
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin,
)

const RequestTypeWaterfallChart = ({ data }) => {
    // Procesar datos para el formato de cascada
    const labels = data.map(item => item.label)
    const values = data.map(item => item.count)

    // Configurar colores y posiciones
    const backgroundColors = values.map((val, index) =>
        index === values.length - 1 ? '#004B9A' : '#4BC0C0',
    )

    // Configuración del gráfico
    const options = {
        responsive: true,
        maintainAspectRatio: false, 
        elements: {
            bar: {
                borderRadius: 4,
                borderSkipped: 'start',
            },
        },
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Distribución de Tipos de Solicitud',
            },
            tooltip: {
                callbacks: {
                    label: context => {
                        const label = context.dataset.label || ''
                        const value = context.parsed.y || 0
                        return `${label}: ${value} solicitudes`
                    },
                },
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        xMin: 5,
                        xMax: 1,
                        borderColor: '#004B9A',
                        borderWidth: 2,
                    },
                },
            },
        },
        scales: {
            x: { title: { display: true, text: 'Tipos de Solicitud' } },
            y: { title: { display: true, text: 'Cantidad' } },
        },
    }

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Solicitudes',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors,
                borderWidth: 1,
                datalabels: { display: false },
                categoryPercentage: 0.6,
                barPercentage: 0.8,
                base: 0,
                stack: 'stack',
            },
        ],
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md h-[60vh]">
            <Bar data={chartData} options={options} />
        </div>
    )
}

export default RequestTypeWaterfallChart
