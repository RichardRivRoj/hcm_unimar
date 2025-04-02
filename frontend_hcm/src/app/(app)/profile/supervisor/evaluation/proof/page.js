// app/dashboard/evaluaciones/page.js
'use client'
import UnevaluatedEmployeesList from './UnevaluatedEmployeesList'

const EvaluationPage = () => {

  return (
    <div className="container px-4 mx-auto">
      <UnevaluatedEmployeesList />
    </div>
  )
}

export default EvaluationPage