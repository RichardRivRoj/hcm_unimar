'use client'

import React, { useRef, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { getDolarPrice } from '@/services/dolarService'

const DollarPrice = () => {
    const scrollRef = useRef(null)
    const [dollarData, setDollarData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDollarPrice = async () => {
            try {
                const data = await getDolarPrice()

                const formattedDate = new Date(
                    data.fechaActualizacion,
                ).toLocaleDateString('es-VE', {
                    timeZone: 'UTC',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                })

                setDollarData({
                    ...data,
                    fechaFormateada: formattedDate,
                })
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchDollarPrice()
    }, [])

    useEffect(() => {
        if (scrollRef.current && !loading && !error) {
            scrollRef.current.style.animation = 'marquee 20s linear infinite'
        }
    }, [loading, error])

    if (loading) return null
    if (error) return null

    return (
        <>
            <style>
                {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
            </style>
            <div className="overflow-hidden bg-[#d0e0fc] text-[#0b3d91]">
                <div ref={scrollRef} className="whitespace-nowrap">
                    <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="mr-2 text-[#0b3d91]"
                    />
                    "El valor del dólar, según el BCV, para el día de hoy "
                    <span>{dollarData.fechaFormateada} es </span>
                    <strong id="dollar-bcv-price">
                        {dollarData.promedio?.toFixed(2) || 'No disponible'}
                    </strong>
                    {'\u00A0Bs'}
                </div>
            </div>
        </>
    )
}

export default DollarPrice;
