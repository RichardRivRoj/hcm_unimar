import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useAgenda = (id) => {
    const [agenda, setAgenda] = useState(null) // Datos de la agenda
    const [loading, setLoading] = useState(true) // Estado de carga
    const [error, setError] = useState(null) // Manejo de errores

    useEffect(() => {
        const fetchAgenda = async () => {
            try {
                // Hacer la solicitud a la API
                const response = await axios.get(`/api/agendas/${id}`)
                setAgenda(response.data) // Guardar los datos de la agenda
                setLoading(false) // Indicar que la carga ha terminado
            } catch (err) {
                setError(err) // Guardar el error
                setLoading(false) // Indicar que la carga ha terminado
            }
        }

        fetchAgenda() // Llamar a la función para obtener los datos
    }, [id]) // Dependencia: si el ID cambia, se vuelve a ejecutar

    return { agenda, loading, error } // Retornar los estados
}

export default useAgenda
