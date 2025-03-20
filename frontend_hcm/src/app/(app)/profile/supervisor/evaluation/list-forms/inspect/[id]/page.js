'use client';
import React, { useEffect } from 'react';
import useFormEvaluations from '@/hooks/supervisor/useFormEvaluation';
import Image from 'next/image';
import DownloadEvaluationPDF from '@/components/EvaluationPDF';
import { DownloadCloud } from 'lucide-react';
import StandardLoader from '@/components/StandardLoader';
import { formatDateToUTC } from '@/utils/formatDateToUTC';

const EvaluationDetailPage = ({ params }) => {
    const { id } = params;
    const { evaluationDetail, detailLoading, detailError, fetchEvaluationDetail } = useFormEvaluations();

    useEffect(() => {
        if (id) {
            fetchEvaluationDetail(id);
        }
    }, [id]);

    if (detailLoading) return <StandardLoader />;
    if (detailError) return <div className="p-4 text-red-500">Error: {detailError}</div>;

    return (
        <div className="container p-6 mx-auto bg-white rounded-lg shadow-md">
            {/* Encabezado con logo y botón */}
            <div className="flex flex-col items-center mb-8 space-y-4">
                <div className="flex items-center justify-between w-full mb-6">
                    <Image
                        src="/logo-unimar.png"
                        alt="Logo Universidad de Margarita"
                        width={120}
                        height={120}
                    />
                    <div className="flex flex-col flex-1 text-center">
                        <h1 className="text-2xl font-bold uppercase text-[#004b9a]">Evaluación de Desempeño</h1>
                        <h2 className="text-xl text-[#004b9a]">Dirección de Talento Humano</h2>
                    </div>
                </div>

                {/* Botón de descarga destacado */}
                <div className="w-full py-4 bg-[#004b9a]/10 rounded-lg mx-auto flex items-center gap-2 px-6  text-white bg-[#004b9a] hover:bg-[#003a7d] transition-colors">
                <DownloadCloud className="w-5 h-5" />
                    <DownloadEvaluationPDF 
                        evaluationDetail={evaluationDetail}
                        className=""
                    >
                        
                        <span>Descargar Planilla</span>
                    </DownloadEvaluationPDF>
                </div>
            </div>

            {/* Contenido principal */}
            {evaluationDetail && (
                <div className="space-y-6">
                    {/* Sección de datos del empleado */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {[['Nombres y Apellidos', evaluationDetail.evaluated_employee.full_name],
                          ['Departamento', evaluationDetail.evaluated_employee.department]].map(([label, value]) => (
                            <div key={label} className="pb-2 border-b-2 border-[#004b9a]/30">
                                <p className="font-semibold text-[#004b9a]">{label}</p>
                                <p className="text-gray-700">{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tabla de información con estilos institucionales */}
                    <table className="w-full mb-8 overflow-hidden border-collapse rounded-lg shadow">
                        <tbody>
                            {[
                                ['Cédula de Identidad', `${evaluationDetail.evaluated_employee.identification.type}-${evaluationDetail.evaluated_employee.identification.value}`, 'Fecha de Ingreso', formatDateToUTC(evaluationDetail.evaluated_employee.start_date)],
                                ['Periodo de Evaluación', evaluationDetail.evaluation_details.period, 'Cargo', evaluationDetail.evaluated_employee.position],
                                ['Condición Laboral', evaluationDetail.evaluated_employee.employment_type, 'Nombre del Evaluador', evaluationDetail.evaluation_details.evaluator]
                            ].map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b border-[#004b9a]/20">
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="p-3 even:border-l border-[#004b9a]/20">
                                            {cellIndex % 2 === 0 ? (
                                                <p className="font-semibold text-[#004b9a]">{cell}</p>
                                            ) : (
                                                <p className="text-gray-700">{cell}</p>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Sección de factores de evaluación */}
                    <div className="mb-8">
                        <h2 className="mb-6 text-xl font-bold text-[#004b9a] border-l-4 border-[#004b9a] pl-3">
                            FACTORES DE EVALUACIÓN
                        </h2>
                        
                        {evaluationDetail.sections.map((section) => (
                            <div key={section.section_id} className="mb-6 bg-[#f8f9fa] p-4 rounded-lg">
                                <h3 className="mb-3 text-lg font-semibold text-[#004b9a]">{section.section_name}</h3>
                                <div className="space-y-4">
                                    {section.questions.map((question) => (
                                        <div key={question.question_id} className="pl-4 ml-4 border-l-2 border-[#004b9a]">
                                            <p className="mb-2 text-gray-700">{question.question_text}</p>
                                            <div className="flex flex-wrap justify-between gap-2">
                                                <span className="text-sm text-[#004b9a] font-medium">
                                                    Puntuación: {question.score}/5 - 
                                                    {evaluationDetail.rating_scale.find(rs => rs.score === question.score)?.label}
                                                </span>
                                                {question.comments && (
                                                    <p className="text-sm italic text-gray-600">
                                                        Comentarios: {question.comments}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sección de puntuación final */}
                    <div className="p-4 mt-8 text-center bg-[#004b9a]/10 rounded-lg">
                        <p className="text-2xl font-bold text-[#004b9a]">
                            Puntuación Total: {evaluationDetail.evaluation_details.total_score}/100
                        </p>
                    </div>

                    {/* Tabla de escala de puntuación */}
                    <div className="mt-8">
                        <h3 className="mb-4 text-lg font-bold text-[#004b9a]">Escala de Puntuación</h3>
                        <div className="overflow-hidden rounded-lg shadow">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#004b9a] text-white">
                                        <th className="p-3">Puntuación</th>
                                        <th className="p-3">Nivel</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {evaluationDetail.rating_scale.map((nivel) => (
                                        <tr key={nivel.score} className="even:bg-[#f8f9fa]">
                                            <td className="p-3 font-medium text-center">{nivel.score}</td>
                                            <td className="p-3 text-center">{nivel.label}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Área de firmas */}
                    <div className="mt-12">
                        <h2 className="mb-6 text-xl font-bold text-[#004b9a] border-l-4 border-[#004b9a] pl-3">
                            FIRMAS DE CONFORMIDAD
                        </h2>
                        <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-3">
                            {['EL TRABAJADOR(A)', 'EVALUADOR(A)', 'DIRECTORA DE TALENTO HUMANO'].map((title) => (
                                <div key={title} className="text-center">
                                    <div className="h-20 mb-4 border-b-2 border-[#004b9a]"></div>
                                    <p className="text-sm font-medium text-[#004b9a]">{title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EvaluationDetailPage;