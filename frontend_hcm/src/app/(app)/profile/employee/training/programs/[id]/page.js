'use client'

import { useEffect } from "react"
import PublicProgramDetail from "./PublicProgramDetail"
import EnrolledProgramDetail from "./EnrolledProgramDetail"
import Loader from "@/components/Loader"
import { Alert, AlertDescription } from "@/components/alert"
import ProgramResultsDetail from "./CompleteProgramDetail"
import StandardLoader from "@/components/StandardLoader"

const { useEmployeeTrainings } = require("@/hooks/employee/useEmployeeTrainings")

const TrainingProgramDetail = ({ params }) => {
    const { programDetails, enroll  } = useEmployeeTrainings()
    const { id } = params

    useEffect(() => {
        if(id) programDetails.show(id)
    }, [id])

    const handleEnroll = async (programId) => {
        try {
            const result = await enroll(programId)
            programDetails.show(id) // Recargar detalles
            return result
        } catch (error) {
            throw error
        }
    }

    if(programDetails.isLoading) return <StandardLoader />
    if(programDetails.error) return <Alert>
        <AlertDescription>
            {programDetails.error}
        </AlertDescription>
    </Alert>

    return (
        <div className="px-4 py-8 mx-auto max-w-7xl">
            {programDetails.data?.classification === 'PUBLICO' && (
                <PublicProgramDetail program={programDetails.data} onEnroll={handleEnroll} />
            )}
            {(programDetails.data?.classification === 'INSCRITOS' || programDetails.data?.classification === 'EN_PROGRESO') && (
                <EnrolledProgramDetail program={programDetails.data} />
            )}
            {programDetails.data?.classification === 'COMPLETADO' && (
                <ProgramResultsDetail program={programDetails.data} />
            )}
        </div>
    )
}

export default TrainingProgramDetail;