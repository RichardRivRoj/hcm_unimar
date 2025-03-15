export const getAssignedByText = (value) => {
    switch(value) {
        case 1: return "Dirección de Talento Humano";
        case 0: return "Autoinscripción (Empleado)";
        default: return "N/A";
    }
}