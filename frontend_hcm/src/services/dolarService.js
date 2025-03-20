import axios from "@/lib/axios";

export const getDolarPrice = async () => {
    try {
        const response = await axios.get('/api/dolar'); // Cambia a tu dominio
        if (response.status !== 200) throw new Error('Error al obtener datos');
        return response.data; // Axios ya parsea la respuesta JSON
    } catch (error) {
        console.error('Error fetching dollar price:', error);
        throw error;
    }
};
