'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useEnrollmentDetails = (enrollmentId) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchEnrollmentDetails = async () => {
            try {
                setLoading(true)
                setError(null)

                // Realiza la solicitud al endpoint
                const { data: responseData } = await axios.get(
                    `/api/admin/registration-history/${enrollmentId}/enroll`
                )

                // Normalización de datos
                const normalizedData = {
                    enrollment: {
                        id: responseData.enrollment.id,
                        enrollment_date: responseData.enrollment.enrollment_date
                            ? new Date(responseData.enrollment.enrollment_date)
                            : null,
                        status: responseData.enrollment.status || 'Unknown',
                        score: responseData.enrollment.score || 'N/A',
                        attendance_rate: responseData.enrollment.attendance_rate || 'N/A',
                        assigned_by: responseData.enrollment.assigned_by || 'N/A'
                    },
                    employee: {
                        full_name: responseData.employee.full_name || 'N/A',
                        identification: {
                            code: responseData.employee.identification.code || 'N/A',
                            number: responseData.employee.identification.number || 'N/A'
                        },
                        current_contract: {
                            department: responseData.employee.current_contract.department || 'N/A',
                            position: responseData.employee.current_contract.position || 'N/A',
                            contract_type: responseData.employee.current_contract.contract_type || 'N/A',
                            start_date: responseData.employee.current_contract.start_date
                                ? new Date(responseData.employee.current_contract.start_date)
                                : null
                        },
                        contact: {
                            corporate_email: responseData.employee.contact.corporate_email || 'N/A',
                            phone: responseData.employee.contact.phone || 'N/A'
                        }
                    },
                    program: {
                        name: responseData.program.name || 'N/A',
                        description: responseData.program.description || 'N/A',
                        schedule: {
                            start: responseData.program.schedule.start
                                ? new Date(responseData.program.schedule.start)
                                : null,
                            end: responseData.program.schedule.end
                                ? new Date(responseData.program.schedule.end)
                                : null,
                            duration: responseData.program.schedule.duration || 'N/A'
                        },
                        modality: responseData.program.modality || 'N/A',
                        type: responseData.program.type || 'N/A',
                        visibility: responseData.program.visibility || 'N/A',
                        status: responseData.program.status || 'N/A'
                    }
                }

                setData(normalizedData)
            } catch (err) {
                // Manejo de errores
                if (err.response?.status === 404) {
                    setError('Enrollment not found')
                } else if (err.response?.status === 500) {
                    setError('Server error')
                } else {
                    setError(err.message || 'Failed to load data')
                }
            } finally {
                setLoading(false)
            }
        }

        if (enrollmentId) {
            fetchEnrollmentDetails()
        }
    }, [enrollmentId])

    // Nueva función de actualización
    const updateEnrollment = async (score, attendanceRate) => {
        try {
            const response = await axios.put(
                `/api/admin/registration-history/${enrollmentId}/enroll`,
                {
                    score: parseFloat(score),
                    attendance_rate: parseFloat(attendanceRate)
                }
            )

            // Actualizar datos locales
            setData(prev => ({
                ...prev,
                enrollment: {
                    ...prev.enrollment,
                    ...response.data.enrollment,
                    status: 'Completado'
                }
            }))
            
            return { success: true }
        } catch (err) {
            return { 
                success: false,
                error: err.response?.data?.message || 'Error al actualizar'
            }
        }
    }

    return { data, loading, error, updateEnrollment }
}

export default useEnrollmentDetails
