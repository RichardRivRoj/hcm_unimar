'use client'

import React, { useState, memo, useCallback, useEffect, useRef } from 'react'
import SectionStep from './SectionStep'
import { useNavigation } from '@/providers/NavigationProvider'
import RatingScale from '@/components/RatingScale'

const CompetenceStep = memo(
    ({ sections, scores, setScores, onAllSectionsComplete }) => {
        const { navigation, updateNavigation } = useNavigation()
        const navigationRef = useRef(navigation)
        navigationRef.current = navigation


        if (!sections || sections.length === 0)
            return <div>Cargando secciones...</div>

        // 1. Verificar carga inicial de preguntas
        useEffect(() => {
            if (
                sections.length > 0 &&
                !sections[navigation.currentSection]?.questions
            ) {
                console.error(
                    'Sección sin preguntas:',
                    sections[navigation.currentSection],
                )
            }
        }, [navigation.currentSection, sections])

        // 2. Función mejorada para cambiar de sección
        const handleSectionChange = useCallback(
            newSection => {
                if (newSection >= 0 && newSection < sections.length) {
                    updateNavigation(newSection, 0) // Forzar reinicio a pregunta 0
                    // 3. Inicializar scores para nueva sección
                    setScores(prev => ({
                        ...prev,
                        [sections[newSection].id]:
                            prev[sections[newSection].id] ||
                            sections[newSection].questions?.reduce(
                                (acc, question) => ({
                                    ...acc,
                                    [question.id]: { score: null, comment: '' },
                                }),
                                {},
                            ),
                    }))
                }
            },
            [sections, updateNavigation, setScores],
        )

        const handleScoreChange = (sectionId, questionId, type, value) => {
            setScores(prev => ({
                ...prev,
                [sectionId]: {
                    ...prev[sectionId],
                    [questionId]: {
                        ...(prev[sectionId]?.[questionId] || {}),
                        [type]: value,
                    },
                },
            }))
        }

        // Función mejorada para validar sección completa
        const isSectionComplete = useCallback(
            section => {
                return (
                    section.questions?.every(question => {
                        const questionData = scores[section.id]?.[question.id]
                        return (
                            questionData?.score !== undefined &&
                            questionData?.score !== null
                        )
                    }) ?? false
                )
            },
            [scores],
        )

        // 5. Detectar cuando se completa la última sección
        useEffect(() => {
            const isAllSectionsComplete = sections.every(isSectionComplete)
            if (isAllSectionsComplete) {
                const lastSectionIndex = sections.length - 1
                if (navigationRef.current.currentSection === lastSectionIndex) {
                    onAllSectionsComplete()
                }
            }
        }, [navigation.currentSection, sections.length, isSectionComplete])

        // 6. Modificar el manejador de siguiente sección
        const handleNextSection = useCallback(() => {
            const nextSection = navigation.currentSection + 1
            if (nextSection < sections.length) {
                updateNavigation(nextSection, 0)
            } else {
                onAllSectionsComplete()
            }
        }, [navigation.currentSection, sections.length, updateNavigation, onAllSectionsComplete])

        return (
            <div className="space-y-8">
                
                {sections.map((section, index) => {
                    const sectionQuestions = section.questions || []
                    return (
                        <div
                            key={`section-${section.id}-${index}`}
                            className={
                                index === navigation.currentSection
                                    ? 'block'
                                    : 'hidden'
                            }>
                            {sectionQuestions.length > 0 ? (
                                <>
                                    <div className="p-4 mb-6 rounded-lg bg-gray-50">
                                        <h2 className="text-xl font-semibold text-[#004b9a]">
                                            {section.name}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            Sección {index + 1} de{' '}
                                            {sections.length}
                                        </p>
                                    </div>
                                    <RatingScale />
                                    <SectionStep
                                        section={{
                                            ...section,
                                            questions: sectionQuestions,
                                        }}
                                        currentQuestionIndex={
                                            navigation.currentQuestion
                                        }
                                        setCurrentQuestionIndex={question =>
                                            updateNavigation(
                                                navigation.currentSection,
                                                question,
                                            )
                                        }
                                        onNext={handleNextSection}
                                        onPrev={() =>
                                            handleSectionChange(
                                                navigation.currentSection - 1,
                                            )
                                        }
                                        scores={scores[section.id] || {}}
                                        onScoreChange={handleScoreChange}
                                        isCurrent={
                                            index === navigation.currentSection
                                        }
                                        isComplete={isSectionComplete(section)}
                                    />
                                </>
                            ) : (
                                <div className="p-4 text-red-500">
                                    Error: La sección no tiene preguntas
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    },
    (prev, next) => {
        return (
            prev.scores === next.scores &&
            prev.currentSectionIndex === next.currentSectionIndex
        )
    },
)

export default CompetenceStep

