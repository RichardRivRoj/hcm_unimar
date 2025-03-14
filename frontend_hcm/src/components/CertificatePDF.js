import React from 'react'
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
} from '@react-pdf/renderer'
import writtenNumber from 'written-number'

writtenNumber.defaults.lang = 'es'

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#004b9a',
        paddingBottom: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 50,
        marginRight: 15,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#004b9a',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    section: {
        marginBottom: 25,
    },
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#004b9a',
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#004b9a',
        paddingBottom: 3,
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#333',
        width: '40%',
        textTransform: 'uppercase',
    },
    labelfirm: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#333',
        width: '50%',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    value: {
        fontSize: 11,
        width: '58%',
        fontWeight: 'normal',
    },
    signatureSection: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    signatureBox: {
        width: '45%',
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 10,
        textAlign: 'center',
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

const CertificatePDF = ({ employee, program, enrollment }) => {
    const safeDate = dateString => {
        try {
            const date = new Date(dateString + 'T00:00:00Z').toLocaleDateString(
                'es-ES',
                {
                    timeZone: 'UTC',
                },
            )
            return isNaN(date) ? 'N/A' : date
        } catch {
            return 'N/A'
        }
    }

    const formatDate = dateString => {
        const date = safeDate(dateString)
        if (date === 'N/A') return 'N/A'

        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC',
        })
    }

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
                    <Image
                        src="/logo-5.png"
                        style={styles.logo}
                        cache={false}
                    />
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>
                            Certificado de Finalización
                        </Text>
                        <Text style={styles.subtitle}>
                            Programa de Capacitación Corporativa
                        </Text>
                    </View>
                </View>

                {/* Datos del Participante */}
                <View style={styles.section}>
                    <Text style={styles.heading}>Datos del Participante</Text>

                    <View style={styles.dataRow}>
                        <Text style={styles.label}>Nombre completo:</Text>
                        <Text style={styles.value}>
                            {employee.full_name.toUpperCase()}
                        </Text>
                    </View>

                    <View style={styles.dataRow}>
                        <Text style={styles.label}>Identificación:</Text>
                        <Text style={styles.value}>
                            {employee.identification.code}-
                            {employee.identification.number}
                        </Text>
                    </View>

                    <View style={styles.dataRow}>
                        <Text style={styles.label}>Cargo actual:</Text>
                        <Text style={styles.value}>
                            {employee.current_contract.position}
                        </Text>
                    </View>
                </View>

                {/* Detalles del Programa */}
                <View style={styles.section}>
                    <Text style={styles.heading}>Detalles del Programa</Text>

                    <View style={styles.dataRow}>
                        <Text style={styles.label}>Nombre del programa:</Text>
                        <Text style={styles.value}>
                            {program.name.toUpperCase()}
                        </Text>
                    </View>

                    <View style={styles.dataRow}>
                        <Text style={styles.label}>Duración:</Text>
                        <Text style={styles.value}>
                            {program.schedule.duration}
                        </Text>
                    </View>

                    <View style={styles.dataRow}>
                        <Text style={styles.label}>Fecha de inicio:</Text>
                        <Text style={styles.value}>
                            {formatDate(program.schedule.start)}
                        </Text>
                    </View>

                    <View style={styles.dataRow}>
                        <Text style={styles.label}>Fecha de culminación:</Text>
                        <Text style={styles.value}>
                            {formatDate(program.schedule.end)}
                        </Text>
                    </View>
                </View>

                {/* Resultados */}
                <View style={styles.section}>
                    <Text style={styles.heading}>Resultados Obtenidos</Text>

                    <View style={styles.dataRow}>
                        <Text style={styles.label}>Calificación final:</Text>
                        <Text style={styles.value}>
                            {enrollment.score}/100 (
                            {writtenNumber(enrollment.score, {
                                noAnd: true,
                            }).toUpperCase()}{' '}
                            PUNTOS)
                        </Text>
                    </View>

                    <View style={styles.dataRow}>
                        <Text style={styles.label}>Asistencia:</Text>
                        <Text style={styles.value}>
                            {enrollment.attendance_rate}%
                        </Text>
                    </View>
                </View>

                {/* Firmas */}
                <View style={styles.signatureSection}>
                    <View style={styles.signatureBox}>
                        <Text style={[styles.value, { marginBottom: 6 }]}>
                        </Text>
                        <Text style={styles.labelfirm}>FIRMA DEL INSTRUCTOR</Text>
                        <Text style={[styles.value, { fontSize: 9 }]}>
                            Nombre y Cédula
                        </Text>
                    </View>

                    <View style={styles.signatureBox}>
                        <Text style={[styles.value, { marginBottom: 6 }]}>
                        </Text>
                        <Text style={styles.labelfirm}>
                            FIRMA DEL DIRECTOR RRHH
                        </Text>
                        <Text style={[styles.value, { fontSize: 9 }]}>
                            Nombre y Cédula
                        </Text>
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

export default CertificatePDF
