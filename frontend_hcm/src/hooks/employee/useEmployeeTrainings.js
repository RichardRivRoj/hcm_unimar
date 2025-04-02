'use client'

import useSWR from 'swr'
import axios from '@/lib/axios'
import { useState } from 'react'

const fetcher = url => axios.get(url).then(res => res.data)

export const useEmployeeTrainings = (filters = {}) => {
    const [publicPage, setPublicPage] = useState(1)
    const [enrolledPage, setEnrolledPage] = useState(1)
    const [completedPage, setCompletedPage] = useState(1)
    const [selectedProgramId, setSelectedProgramId] = useState(null)

    const listParams = new URLSearchParams({
        ...filters,
        public_page: publicPage,
        enrolled_page: enrolledPage,
        completed_page: completedPage,
        per_page: 2
    })

    const { data: programDetails, error: detailsError, mutate: mutateDetails } = useSWR(
        selectedProgramId ? `/api/employee/training-programs/${selectedProgramId}` : null,
        fetcher
    )

    const { data, error, mutate } = useSWR(
        `/api/employee/training-programs?${listParams}`,
        fetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    )

    const show = (programId) => {
        setSelectedProgramId(programId)
    }

    const enroll = async (programId) => {
        try {
            await axios.post('/api/employee/training-programs/enroll', {
                training_program_id: programId
            })
            
            // Revalidar datos
            mutate()
            mutateDetails()
            
            return true
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al procesar la inscripción')
        }
    }

    const cancelEnrollment = async (programId) => {
        try {
            await axios.delete(`/api/employee/training-programs/${programId}/cancel`)
            
            // Revalidar datos
            mutate()
            mutateDetails()
            
            return true
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al cancelar la inscripción')
        }
    }

    return {
        public: {
            data: data?.public_programs?.data || [],
            pagination: data?.public_programs || { links: [], from: 0, to: 0, total: 0 },
            setPage: setPublicPage,
            isLoading: !error && !data
        },
        enrolled: {
            data: data?.enrolled_programs?.data || [],
            pagination: data?.enrolled_programs || { links: [], from: 0, to: 0, total: 0 },
            setPage: setEnrolledPage,
            isLoading: !error && !data
        },
        completed: {
            data: data?.completed_programs?.data || [],
            pagination: data?.completed_programs || { links: [], from: 0, to: 0, total: 0 },
            setPage: setCompletedPage,
            isLoading: !error && !data
        },
        programDetails: {
            data: programDetails,
            isLoading: !detailsError && selectedProgramId && !programDetails,
            error: detailsError,
            show
        },
        enroll,
        cancelEnrollment,
        error,
    }
}