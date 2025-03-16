'use client'

import { FileText, PencilIcon } from 'lucide-react'

const PersonalDataStep = ({
    formData,
    handleChange,
    identifications,
    genders,
    ethnicities,
    marital,
    countries,
    errorPhoto,
    validateImage,
    dragActive,
    setDragActive,
}) => {
    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Sección Información Básica */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                    Información Básica
                </h3>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Nombres *
                    </label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Apellidos *
                    </label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Fecha de Nacimiento *
                    </label>
                    <input
                        type="date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        max={
                            new Date(
                                new Date().setFullYear(
                                    new Date().getFullYear() - 17,
                                ),
                            )
                                .toISOString()
                                .split('T')[0]
                        }
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Debes tener al menos 17 años para postularte
                    </p>
                </div>
            </div>

            {/* Sección Contacto */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                    Datos de Contacto
                </h3>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Correo Electrónico *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Teléfono/Celular *
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Sección Identificación */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                    Identificación
                </h3>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Tipo de Documento *
                    </label>
                    <select
                        name="identification_type_id"
                        value={formData.identification_type_id}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Seleccionar tipo</option>
                        {identifications.map(iden => (
                            <option key={iden.id} value={iden.id}>
                                {iden.code} - {iden.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Número de Documento *
                    </label>
                    <input
                        type="text"
                        name="identification_value"
                        value={formData.identification_value}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Sección Demográficos */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                    Información Demográfica
                </h3>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Género *
                    </label>
                    <select
                        name="gender_id"
                        value={formData.gender_id}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Seleccionar género</option>
                        {genders.map(gend => (
                            <option key={gend.id} value={gend.id}>
                                {gend.short_name} - {gend.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Etnia
                    </label>
                    <select
                        name="ethnicity_id"
                        value={formData.ethnicity_id}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Seleccionar etnia</option>
                        {ethnicities.map(eth => (
                            <option key={eth.id} value={eth.id}>
                                {eth.short_name} - {eth.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Estado Civil
                    </label>
                    <select
                        name="marital_status_id"
                        value={formData.marital_status_id}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Seleccionar estado</option>
                        {marital.map(mar => (
                            <option key={mar.id} value={mar.id}>
                                {mar.short_name} - {mar.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Sección Adicional */}
            <div className="space-y-4 col-span-full">
                <h3 className="text-lg font-medium text-gray-900">
                    Información Adicional
                </h3>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        País de Residencia *
                    </label>
                    <select
                        name="countries_id"
                        value={formData.countries_id}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Seleccionar país</option>
                        {countries.map(con => (
                            <option key={con.id} value={con.id}>
                                {con.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Resumen Profesional *
                    </label>
                    <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Componente de subida de foto */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Foto tipo carnet (JPG, PNG - Máx. 2MB) *
                    </label>

                    <div
                        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg 
              ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'} 
              transition-colors duration-200 cursor-pointer`}
                        onDragOver={e => {
                            e.preventDefault()
                            setDragActive(true)
                        }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={e => {
                            e.preventDefault()
                            setDragActive(false)
                            const file = e.dataTransfer.files[0]
                            if (validateImage(file)) {
                                handleChange({
                                    target: {
                                        name: 'photo',
                                        value: file,
                                    },
                                })
                            }
                        }}
                        onClick={() =>
                            document.getElementById('photoInput').click()
                        }>
                        {formData.photo ? (
                            <>
                                <div className="relative group">
                                    <img
                                        src={URL.createObjectURL(
                                            formData.photo,
                                        )}
                                        alt="Previsualización de foto"
                                        className="object-cover w-32 h-32 rounded-full shadow-lg"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100">
                                        <PencilIcon className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-gray-600">
                                    Haz clic para cambiar la foto
                                </p>
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-12 h-12 mb-2 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold text-blue-600">
                                            Haz clic para subir
                                        </span>{' '}
                                        o arrastra aquí
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Tamaño recomendado: 300x300 px
                                    </p>
                                </div>
                            </>
                        )}

                        <input
                            id="photoInput"
                            type="file"
                            name="photo"
                            onChange={e => {
                                const file = e.target.files[0]
                                if (validateImage(file)) {
                                    handleChange({
                                        target: {
                                            name: 'photo',
                                            value: file,
                                        },
                                    })
                                }
                            }}
                            accept=".jpg,.jpeg,.png"
                            className="hidden"
                            required
                        />
                    </div>

                    {errorPhoto && (
                        <p className="mt-2 text-sm text-red-600">
                            {errorPhoto}
                        </p>
                    )}
                </div>

                {/* Componente de subida de CV */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Curriculum Vitae (PDF) *
                    </label>

                    <div
                        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg 
                ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'} 
                transition-colors duration-200 cursor-pointer`}
                        onDragOver={e => {
                            e.preventDefault()
                            setDragActive(true)
                        }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={e => {
                            e.preventDefault()
                            setDragActive(false)
                            const file = e.dataTransfer.files[0]
                            if (file?.type === 'application/pdf') {
                                handleChange(prev => ({
                                    ...prev,
                                    resume: file,
                                }))
                            }
                        }}
                        onClick={() =>
                            document.getElementById('resumeInput').click()
                        }>
                        {formData.resume ? (
                            <div className="text-center">
                                <FileText className="w-12 h-12 mx-auto text-blue-600" />
                                <p className="mt-2 text-sm font-medium text-gray-900">
                                    {formData.resume.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Haz clic para cambiar el archivo
                                </p>
                            </div>
                        ) : (
                            <>
                                <svg
                                    className="w-12 h-12 mb-2 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold text-blue-600">
                                            Haz clic para subir
                                        </span>{' '}
                                        o arrastra aquí
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Formato requerido: PDF
                                    </p>
                                </div>
                            </>
                        )}
                        <input
                            id="resumeInput"
                            type="file"
                            name="resume"
                            onChange={e => {
                                const file = e.target.files[0]
                                if (file?.type === 'application/pdf') {
                                    handleChange({
                                        target: {
                                            name: 'resume',
                                            value: file,
                                        },
                                    })
                                }
                            }}
                            accept=".pdf"
                            className="hidden"
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PersonalDataStep
