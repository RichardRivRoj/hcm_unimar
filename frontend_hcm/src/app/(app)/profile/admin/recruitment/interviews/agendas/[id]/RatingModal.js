'use client'

import { useState } from 'react'
import { StarIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { GeneralModal } from '@/components/Modal'
import axios from '@/lib/axios'

const RatingModal = ({ isOpen, onClose, agendaId, onSuccess }) => {
    const [ratingForm, setRatingForm] = useState({
        score: 0,
        comments: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await axios.post('/api/agenda-results', {
                ...ratingForm,
                agenda_id: agendaId,
            })

            if (response.data.success) {
                onSuccess()
                onClose()
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Error al guardar la calificación',
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <GeneralModal
            size="lg"
            isOpen={isOpen}
            onClose={onClose}
            className="bg-[#004b9a]/20 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col h-full max-h-[75vh] overflow-auto scrollbar-none">
                {/* Encabezado */}
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#004b9a]/20">
                    <div className="p-2 bg-[#004b9a]/10 rounded-lg">
                        <StarIcon className="w-6 h-6 text-[#004b9a]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#004b9a]">
                        Evaluar Evento
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Campo de puntuación */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-[#004b9a]">
                            Calificación del 1 al 10
                            <span className="ml-1 text-[#004b9a]/70">
                                (requerido)
                            </span>
                        </label>
                        <div className="relative">
                            <input
                                type="range"
                                name="score"
                                value={ratingForm.score}
                                onChange={e =>
                                    setRatingForm({
                                        ...ratingForm,
                                        score: Math.min(
                                            10,
                                            Math.max(1, e.target.value),
                                        ),
                                    })
                                }
                                min="1"
                                max="10"
                                step="1"
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-[#004b9a]"
                            />
                            <div className="flex justify-between px-1 mt-2 text-sm text-[#004b9a]/80">
                                {[...Array(10)].map((_, i) => (
                                    <span
                                        key={i + 1}
                                        className="w-4 text-center">
                                        {i + 1}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-[#004b9a]/70">
                            Seleccione un valor entre 1 (Muy deficiente) y 10
                            (Excelente)
                        </p>
                    </div>

                    {/* Campo de comentarios */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-[#004b9a]">
                            Comentarios detallados
                            <span className="ml-1 text-[#004b9a]/70">
                                (requerido)
                            </span>
                        </label>
                        <div className="relative">
                            <textarea
                                name="comments"
                                value={ratingForm.comments}
                                onChange={e =>
                                    setRatingForm({
                                        ...ratingForm,
                                        comments: e.target.value.slice(0, 500),
                                    })
                                }
                                className="w-full p-3 border-2 border-[#004b9a]/20 rounded-lg focus:border-[#004b9a] focus:ring-2 focus:ring-[#004b9a]/30 transition-all"
                                rows="4"
                                placeholder="Ej: Detalla aspectos relevantes del evento, puntos fuertes y áreas de mejora..."
                                required
                            />
                            <div className="absolute bottom-2 right-2 text-sm text-[#004b9a]/70 bg-white px-2 rounded">
                                {ratingForm.comments.length}/500
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-[#004b9a]/70">
                            Por favor sea específico y objetivo en sus
                            comentarios
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
                            {error}
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex items-center gap-2 px-5 py-2.5 text-[#004b9a] bg-white border-2 border-[#004b9a]/20 rounded-lg hover:border-[#004b9a]/40 hover:bg-[#004b9a]/5 transition-all">
                            <XMarkIcon className="w-5 h-5" />
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-2.5 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7d] transition-colors">
                            <CheckIcon className="w-5 h-5" />
                            {loading ? 'Guardando...' : 'Guardar Evaluación'}
                        </button>
                    </div>
                </form>
            </div>
        </GeneralModal>
    )
}

export default RatingModal
