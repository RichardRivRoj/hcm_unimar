'use client'
import React from 'react'
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    PDFDownloadLink,
    Image,
    Font,
} from '@react-pdf/renderer'
import writtenNumber from 'written-number'
import { toast } from 'sonner'

// Configurar written-number en español
writtenNumber.defaults.lang = 'es'

Font.register({
    family: 'Times-Roman',
    fonts: [
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Times/Times-Roman.ttf',
        },
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Times/Times-Bold.ttf',
            fontWeight: 'bold',
        },
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Times/Times-Italic.ttf',
            fontStyle: 'italic',
        },
    ],
})

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Times-Roman',
        fontSize: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderBottom: '1px solid black',
        paddingBottom: 15,
    },
    logo: {
        width: 270,
        height: 50,
        marginRight: 20,
    },
    headerText: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottom: '1px solid #666',
        paddingBottom: 3,
    },
    dataRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    dataLabel: {
        width: '30%',
        fontWeight: 'bold',
        paddingRight: 6,
    },
    dataValue: {
        width: '70%',
        borderBottom: '1px solid #999',
        paddingBottom: 2,
    },
    factorTable: {
        border: '1px solid #000',
        marginBottom: 15,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #000',
        paddingVertical: 5,
    },
    headerFactor: {
        width: '25%',
        padding: 5,
        fontWeight: 'bold',
    },
    headerDescription: {
        width: '55%',
        padding: 5,
        fontWeight: 'bold',
    },
    headerScore: {
        width: '20%',
        padding: 5,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    factorRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #ddd',
    },
    factorCell: {
        width: '20%',
        padding: 4,
        borderRight: '1px solid #ddd',
    },
    questionCell: {
        width: '40%',
        padding: 4,
        borderRight: '1px solid #ddd',
    },
    scoreCell: {
        width: '20%',
        padding: 4,
        textAlign: 'center',
        borderRight: '1px solid #ddd',
    },
    commentCell: {
        width: '20%',
        padding: 4,
    },
    observations: {
        marginTop: 10,
    },
    observationBox: {
        border: '1px solid #000',
        minHeight: 20,
        padding: 10,
        marginTop: 6,
    },
    signatures: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
    },
    signatureBox: {
        width: '30%',
        alignItems: 'center',
    },
    signatureLine: {
        width: '100%',
        borderTop: '1px solid #000',
        marginTop: 25,
        marginBottom: 5,
    },
    ratingTable: {
        border: '1px solid #000',
        marginTop: 6,
        width: '40%',
        alignSelf: 'center',
    },
    ratingRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #000',
    },
    ratingCell: {
        width: '40%',
        padding: 2,
        textAlign: 'left',
    },
    totalScore: {
        marginTop: 6,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        fontSize: 8,
        color: '#666',
        textAlign: 'center',
    },
})

const EvaluationPDF = ({ evaluationDetail }) => {
    if (!evaluationDetail || !evaluationDetail.evaluation_details) {
        return <div>No hay datos disponibles para generar el PDF.</div>
    }
    const totalScoreText = writtenNumber(
        Math.floor(evaluationDetail.evaluation_details.total_score),
        { noAnd: true },
    )

    const currentDate = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    })

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Encabezado */}
                <View style={styles.header}>
                    <Image src="/logo-5.png" style={styles.logo} />
                    <View style={styles.headerText}>
                        <Text style={styles.title}>
                            Evaluación de Desempeño
                        </Text>
                        <Text style={styles.subtitle}>
                            Dirección de Talento Humano
                        </Text>
                    </View>
                </View>

                {/* Datos del empleado */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DATOS DEL EMPLEADO</Text>
                    <View style={styles.dataRow}>
                        <Text style={styles.dataLabel}>Nombre completo:</Text>
                        <Text style={styles.dataValue}>
                            {evaluationDetail.evaluated_employee.full_name}
                        </Text>
                    </View>
                    <View style={styles.dataRow}>
                        <Text style={styles.dataLabel}>Cédula:</Text>
                        <Text style={styles.dataValue}>
                            {
                                evaluationDetail.evaluated_employee
                                    .identification.type
                            }
                            -
                            {
                                evaluationDetail.evaluated_employee
                                    .identification.value
                            }
                        </Text>
                    </View>
                    <View style={styles.dataRow}>
                        <Text style={styles.dataLabel}>Departamento:</Text>
                        <Text style={styles.dataValue}>
                            {evaluationDetail.evaluated_employee.department}
                        </Text>
                    </View>
                    <View style={styles.dataRow}>
                        <Text style={styles.dataLabel}>Cargo:</Text>
                        <Text style={styles.dataValue}>
                            {evaluationDetail.evaluated_employee.position}
                        </Text>
                    </View>
                    <View style={styles.dataRow}>
                        <Text style={styles.dataLabel}>Periodo evaluado:</Text>
                        <Text style={styles.dataValue}>
                            {evaluationDetail.evaluation_details.period}
                        </Text>
                    </View>
                    <View style={styles.dataRow}>
                        <Text style={styles.dataLabel}>Evaluador:</Text>
                        <Text style={styles.dataValue}>
                            {evaluationDetail.evaluation_details.evaluator}
                        </Text>
                    </View>
                </View>

                {/* Factores de evaluación */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        FACTORES DE EVALUACIÓN
                    </Text>
                    <View style={styles.factorTable}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.headerFactor}>Factor</Text>
                            <Text style={styles.headerDescription}>
                                Descripción
                            </Text>
                            <Text style={styles.headerScore}>Puntuación</Text>
                            <Text style={styles.headerScore}>Comentarios</Text>
                        </View>

                        {evaluationDetail.sections.map(section => (
                            <View key={section.section_id}>
                                {section.questions.map((question, index) => (
                                    <View
                                        key={question.question_id}
                                        style={[
                                            styles.factorRow,
                                            index ===
                                                section.questions.length -
                                                    1 && { borderBottom: 0 },
                                        ]}>
                                        <Text style={styles.factorCell}>
                                            {index === 0 &&
                                                section.section_name}
                                        </Text>
                                        <Text style={styles.questionCell}>
                                            {question.question_text}
                                        </Text>
                                        <Text style={styles.scoreCell}>
                                            {question.score}
                                        </Text>
                                        <Text style={styles.commentCell}>
                                            {question.comments}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Escala de puntuación */}
                <View style={styles.ratingTable}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.ratingCell}>Puntuación</Text>
                        <Text style={styles.ratingCell}>
                            Nivel de desempeño
                        </Text>
                    </View>
                    {evaluationDetail.rating_scale.map(nivel => (
                        <View key={nivel.score} style={styles.ratingRow}>
                            <Text style={styles.ratingCell}>{nivel.score}</Text>
                            <Text style={styles.ratingCell}>{nivel.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Puntuación total */}
                <View style={styles.totalScore}>
                    <Text>
                        PUNTAJE TOTAL:{' '}
                        {evaluationDetail.evaluation_details.total_score}(
                        {totalScoreText})
                    </Text>
                </View>

                {/* Observaciones */}
                <View style={styles.observations}>
                    <Text style={styles.sectionTitle}>OBSERVACIONES</Text>
                    <View style={styles.observationBox}>
                        {[...Array(4)].map((_, i) => (
                            <View
                                key={i}
                                style={{ height: 20, marginBottom: 5 }}
                            />
                        ))}
                    </View>
                </View>

                {/* Firmas */}
                <View style={styles.signatures}>
                    <View style={styles.signatureBox}>
                        <Text>TRABAJADOR(A)</Text>
                        <View style={styles.signatureLine} />
                    </View>
                    <View style={styles.signatureBox}>
                        <Text>EVALUADOR(A)</Text>
                        <View style={styles.signatureLine} />
                    </View>
                    <View style={styles.signatureBox}>
                        <Text>DIRECTORA TALENTO HUMANO</Text>
                        <View style={styles.signatureLine} />
                    </View>
                </View>

                {/* Pie de página */}
                <View style={styles.footer}>
                    <Text>
                        Certificado generado electrónicamente el {currentDate} -
                        Válido mediante resolución N° 001-2024
                    </Text>
                    <Text style={{ marginTop: 4 }}>
                        Este documento es de carácter oficial y forma parte de
                        los registros corporativos
                    </Text>
                </View>
            </Page>
        </Document>
    )
}

const DownloadEvaluationPDF = ({ evaluationDetail }) => (
    <PDFDownloadLink
        document={<EvaluationPDF evaluationDetail={evaluationDetail} />}
        fileName={`evaluacion_${evaluationDetail?.evaluated_employee?.full_name?.replace(/ /g, '_') || 'evaluacion'}.pdf`}>
        {({ loading, error }) => {
            if (error) toast.error('Error generando PDF:', error)
            return loading
                ? 'Generando documento...'
                : 'Descargar evaluación PDF'
        }}
    </PDFDownloadLink>
)

export default DownloadEvaluationPDF
