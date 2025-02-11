import { useState } from "react";
import axios from "@/lib/axios";

const useScheduleInterview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  

  const scheduleInterview = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(`api/agendas`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSuccess(true);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error || "Error al agendar la entrevista.");
    } finally {
      setLoading(false);
    }
  };

  return { scheduleInterview, loading, error, success };
};

export default useScheduleInterview;

