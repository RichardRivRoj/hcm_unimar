import { saveAs } from 'file-saver' // Librería para descargar archivos
import { toast } from 'sonner'

const DownloadCVButton = ({ resumeUrl }) => {
    const handleDownload = async () => {
        try {
            if (!resumeUrl) {
                return
            }

            // Obtener el nombre del archivo desde la URL
            const filename = resumeUrl.split('/').pop()

            // Descargar el archivo
            const response = await fetch(resumeUrl)
            const blob = await response.blob()
            saveAs(blob, filename)

        } catch (error) {
            toast.error('Error al descargar el CV')
        }
    }

    return (
        <button
            onClick={handleDownload}
            className="px-6 py-2 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7d] transition-colors duration-200"
            disabled={!resumeUrl}
        >
            Descargar CV
        </button>
    )
}

export default DownloadCVButton