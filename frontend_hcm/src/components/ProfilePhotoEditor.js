'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, Trash2, X } from 'lucide-react'
import useProfilePhoto from '@/hooks/employee/useProfilePhoto'
import { toast } from 'sonner'

const ProfilePhotoEditor = ({ user, onUpdate }) => {
    const personId = user?.person?.id

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [avatarPosition, setAvatarPosition] = useState({ x: 0, y: 0 })
    const fileInputRef = useRef(null)
    const { updatePhoto, deletePhoto, loading, error } = useProfilePhoto()

    // Estado para manejar errores de validación de la imagen
    const [errorPhoto, setErrorPhoto] = useState('')

    // Validar la imagen
    const validateImage = file => {
        if (!file) {
            setErrorPhoto('Debes seleccionar una imagen.')
            return false
        }

        const validTypes = ['image/jpeg', 'image/png']
        const maxSize = 2 * 1024 * 1024 // 2MB

        if (!validTypes.includes(file.type)) {
            setErrorPhoto('Formato no válido. Solo se permiten JPG/PNG.')
            return false
        }

        if (file.size > maxSize) {
            setErrorPhoto('El archivo es demasiado grande (Máx. 2MB).')
            return false
        }

        setErrorPhoto('')
        return true
    }

    // Manejar clic en el avatar
    const handleAvatarClick = e => {
        const rect = e.target.getBoundingClientRect()
        setAvatarPosition({
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY + rect.height,
        })
        setIsModalOpen(true)
    }

    // Manejar actualización de la foto
    const handleUpdatePhoto = () => {
        fileInputRef.current.click()
    }

    // Manejar cambio de archivo
    const handleFileChange = async e => {
        const file = e.target.files[0]
        if (!file || !personId) return

        if (!validateImage(file)) return

        try {
            const formData = new FormData()
            formData.append('photo', file) // Adjuntar el archivo al FormData

            const newPhotoUrl = await updatePhoto(formData, personId)
            onUpdate({
                ...user,
                person: {
                    ...user.person,
                    photo_url: newPhotoUrl,
                },
            })
        } catch (error) {
            toast.error('Error al actualizar foto')
        } finally {
            setIsModalOpen(false)
        }
    }

    // Manejar eliminación de la foto
    const handleDeletePhoto = async () => {
        if (!personId) return

        try {
            await deletePhoto(personId)
            onUpdate({
                ...user,
                person: {
                    ...user.person,
                    photo_url: null,
                },
            })
        } catch (error) {
            toast.error('Error eliminando foto')
        } finally {
            setIsModalOpen(false)
        }
    }

    // Mostrar errores
    useEffect(() => {
        if (error) alert(error)
    }, [error])

    return (
        <div className="relative group">
            <input
                type="file"
                name="photo"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".jpg,.jpeg,.png"
            />

            <div
                className="relative flex-shrink-0 w-32 h-32 cursor-pointer"
                onClick={handleAvatarClick}>
                {user.person?.photo_url ? (
                    <>
                         <img
                            src={user.person.photo_url}
                            alt={`${user.person.first_name} ${user.person.last_name}`}
                            className="object-cover w-32 h-32 transition-opacity border-4 border-white rounded-full shadow-lg hover:opacity-75"
                        />
                        <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center w-32 h-32 transition-colors bg-gray-200 rounded-full hover:bg-gray-300">
                        <svg
                            className="w-16 h-16 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112 15c3.183 0 6.135.946 8.546 2.564a3 3 0 013.454 3.429zM18 10a6 6 0 11-12 0 6 6 0 0112 0z" />
                        </svg>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div
                        className="relative p-6 bg-white rounded-lg shadow-xl w-80"
                        style={{
                            position: 'absolute',
                            left: `${avatarPosition.x}px`,
                            top: `${avatarPosition.y}px`,
                        }}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute p-1 rounded-full top-2 right-2 hover:bg-gray-100">
                            <X className="w-6 h-6 text-gray-500" />
                        </button>

                        <h3 className="mb-4 text-lg font-semibold text-black">
                            Opciones de foto de perfil
                        </h3>

                        <div className="space-y-3">
                            <button
                                onClick={handleUpdatePhoto}
                                disabled={loading}
                                className="flex items-center w-full px-4 py-3 text-left transition-colors rounded-lg hover:bg-gray-100 disabled:opacity-50">
                                <Camera className="w-5 h-5 mr-3 text-blue-500" />
                                <span className="text-blue-500">
                                    {loading
                                        ? 'Actualizando...'
                                        : 'Cambiar foto de perfil'}
                                </span>
                            </button>

                            {user.person?.photo_url && (
                                <button
                                    onClick={handleDeletePhoto}
                                    disabled={loading}
                                    className="flex items-center w-full px-4 py-3 text-left text-red-600 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50">
                                    <Trash2 className="w-5 h-5 mr-3 text-red-500" />
                                    <span>
                                        {loading
                                            ? 'Eliminando...'
                                            : 'Eliminar foto actual'}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {errorPhoto && (
                <p className="mt-2 text-sm text-red-600">{errorPhoto}</p>
            )}
        </div>
    )
}

export default ProfilePhotoEditor
