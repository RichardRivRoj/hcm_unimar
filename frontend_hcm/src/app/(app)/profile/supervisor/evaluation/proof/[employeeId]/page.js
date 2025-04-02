'use client'
import { useParams, useSearchParams } from 'next/navigation'
import EvaluationWizard from './EvaluationWizard'
import { useMemo } from 'react'

const CreateEvaluationPage = () => {
    const params = useParams()
    const searchParams = useSearchParams()

    const departmentId = useMemo(() => 
        Number(searchParams.get('department_id')),
        [searchParams]
    )

    const periodId = useMemo(() => 
        Number(searchParams.get('period_id')),
        [searchParams]
    )

    return (
        <EvaluationWizard 
            employeeId={Number(params.employeeId)}
            departmentId={departmentId}
            periodId={periodId}
        />
    )
}

export default CreateEvaluationPage