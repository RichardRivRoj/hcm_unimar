import { saveAs } from 'file-saver'; // Librería para descargar archivos

const DownloadCVButton = ({ resumeUrl }) => {
    const handleDownload = async () => {
        try {
            if (!resumeUrl) {
                alert('No hay un CV disponible para descargar.');
                return;
            }

            // Obtener el nombre del archivo desde la URL
            const filename = resumeUrl.split('/').pop();

            // Descargar el archivo
            const response = await fetch(resumeUrl);
            const blob = await response.blob();
            saveAs(blob, filename);

        } catch (error) {
            console.error('Error al descargar el CV:', error);
            alert('Hubo un error al descargar el CV. Inténtalo de nuevo.');
        }
    };

    return (
        <button
            onClick={handleDownload}
            className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
            disabled={!resumeUrl}
        >
            Descargar CV
        </button>
    );
};

export default DownloadCVButton;