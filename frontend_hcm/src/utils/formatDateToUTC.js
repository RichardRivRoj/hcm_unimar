export const formatDateToUTC = (dateString) => {
    const date = new Date(dateString)
    if (isNaN(date)) return 'Fecha inválida'
    
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Meses van de 0-11
    const year = date.getUTCFullYear()

    return `${day}/${month}/${year}`
}

