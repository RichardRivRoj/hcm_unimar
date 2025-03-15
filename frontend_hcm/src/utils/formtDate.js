export default function formatearFecha(fechaUTC) {
    const fecha = new Date(fechaUTC)
    const dia = fecha.getUTCDate().toString().padStart(2, '0') // Día con dos dígitos
    const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0') // Mes con dos dígitos
    const año = fecha.getUTCFullYear() // Año
    return `${dia}/${mes}/${año}`
}
