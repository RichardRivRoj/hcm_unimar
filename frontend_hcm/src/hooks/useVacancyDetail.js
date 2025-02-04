import { useState, useEffect } from "react";
import axios from "@/lib/axios";

const useVacancyDetail = (id) => {
    const [vacancy, setVacancy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para normalizar los requisitos
    const normalizeRequirements = (requirements) => {
        if (Array.isArray(requirements)) {
            return requirements;
        }
        if (typeof requirements === 'string') {
            try {
                return JSON.parse(requirements) || [];
            } catch (err) {
                console.error('Error parsing requirements:', err);
                return [];
            }
        }
        return [];
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/public/vacancies/${id}`);
                const data = response.data.data.vacancy;

                // Normalizar los requisitos
                const normalizedRequirements = normalizeRequirements(data.requirements);

                // Actualizar el estado con los requisitos normalizados
                setVacancy({
                    ...data,
                    requirements: normalizedRequirements,
                });
            } catch (err) {
                setError(err.response?.data?.message || 'Error al cargar la vacante');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    return { vacancy, loading, error };
};

export default useVacancyDetail;