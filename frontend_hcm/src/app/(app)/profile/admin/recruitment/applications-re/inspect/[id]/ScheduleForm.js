import { useState } from "react";

const ScheduleForm = ({ candidateId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    candidate_id: candidateId, // Se recibe como prop
    type_agenda_id: "",
    scheduled_date: "",
    time: "",
    location: "",
    status_id: 1, // Suponiendo que '1' es el estado por defecto
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Llama a la función pasada como prop
  };

  return (
    <>
    </>
    
  );
};

export default ScheduleForm;

