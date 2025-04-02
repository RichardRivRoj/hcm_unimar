import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font,
} from '@react-pdf/renderer'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

Font.register({
    family: 'Helvetica',
    fonts: [
        { src: '/fonts/Helvetica.ttf' },
        { src: '/fonts/Helvetica-Bold.ttf', fontWeight: 'bold' },
    ],
})

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#004b9a',
        paddingBottom: 15,
    },
    logo: {
        width: 210,
        height: 40,
        marginRight: 15,
    },
    headerText: {
        flex: 1,
        textAlign: 'center',
    },
    institutionName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#004b9a',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 10,
        color: '#333',
        marginBottom: 3,
    },
    reportTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#004b9a',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#004b9a',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#004b9a',
        paddingBottom: 3,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    column: {
        width: '48%',
    },
    label: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    value: {
        color: '#666',
        textAlign: 'justify',
    },
    valuetwo: {
        color: '#666',
        textAlign: 'center',
    },
    evaluationTable: {
        width: '100%',
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#004b9a',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tableCell: {
        flex: 1,
        padding: 3,
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    timelineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#004b9a',
        marginRight: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#666',
    },
    signatureSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#004b9a',
    },
    signatureBox: {
        width: '30%',
        textAlign: 'center',
    },
    signatureLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#000',
        margin: '10px 0',
    },
})

const SelectionResultPDF = ({ result }) => {
    // Y actualizamos la obtención de la fecha actual
    const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", {
        locale: es,
    })

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Encabezado Institucional */}
                <View style={styles.header}>
                    <Image src="/logo-5.png" style={styles.logo} />
                    <View style={styles.headerText}>
                        <Text style={styles.institutionName}>
                            UNIVERSIDAD DE MARGARITA
                        </Text>
                        <Text style={styles.subtitle}>
                            Vicerrectorado Académico
                        </Text>
                        <Text style={styles.subtitle}>
                            Dirección de Talento Humano
                        </Text>
                    </View>
                </View>

                {/* Título del Reporte */}
                <Text style={styles.reportTitle}>
                    INFORME FINAL DE PROCESO DE SELECCIÓN
                </Text>

                {/* Sección de Datos del Candidato */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        I. DATOS DEL POSTULANTE
                    </Text>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Nombre completo:</Text>
                            <Text style={styles.value}>
                                {result.candidate.personal_info.full_name.toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>
                                Documento de identidad:
                            </Text>
                            <Text style={styles.value}>
                                {result.candidate.personal_info.identification}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Cargo solicitado:</Text>
                            <Text style={styles.value}>
                                {result.candidate.vacancy_info.position.toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Dependencia:</Text>
                            <Text style={styles.value}>
                                {result.candidate.vacancy_info.department.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Resultados de Evaluación */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        II. RESULTADOS DE EVALUACIÓN
                    </Text>
                    <View style={styles.evaluationTable}>
                        <View style={styles.tableHeader}>
                            <Text
                                style={[
                                    styles.tableCell,
                                    { fontWeight: 'bold' },
                                ]}>
                                Prueba
                            </Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    { fontWeight: 'bold' },
                                ]}>
                                Fecha
                            </Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    { fontWeight: 'bold' },
                                ]}>
                                Puntuación
                            </Text>
                        </View>
                        {result.process_details.agendas.map((agenda, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>
                                    {agenda.type}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {agenda.scheduled_date}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {agenda.score}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Promedio Final:</Text>
                            <Text style={[styles.value, { color: '#004b9a' }]}>
                                {result.process_details.average_score}/10
                            </Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>
                                Total de Evaluaciones:
                            </Text>
                            <Text style={styles.value}>
                                {result.process_details.total_agendas}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Cronología del Proceso */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        III. CRONOGRAMA DEL PROCESO
                    </Text>
                    {result.process_details.timeline.map((event, index) => (
                        <View key={index} style={styles.timelineItem}>
                            <View style={styles.timelineDot} />
                            <View>
                                <Text style={{ fontWeight: 'bold' }}>
                                    {event.event}
                                </Text>
                                <Text>{event.date}</Text>
                                {event.comments && (
                                    <Text style={styles.value}>
                                        {event.comments}
                                    </Text>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Observaciones y Recomendaciones */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>IV. OBSERVACIONES</Text>
                    <Text style={styles.value}>
                        El presente informe certifica que el proceso de
                        selección se ha realizado conforme a los lineamientos
                        establecidos en el Reglamento de Personal de la
                        Universidad de Margarita. Los resultados obtenidos son
                        definitivos y forman parte del expediente del candidato.
                    </Text>
                </View>

                {/* Firmas y Sellos */}
                <View style={styles.signatureSection}>
                    <View style={styles.signatureBox}>
                        <Text style={styles.label}>COMITÉ DE SELECCIÓN</Text>
                        <View style={styles.signatureLine} />
                        <Text style={styles.valuetwo}>Nombre y Firma</Text>
                    </View>

                    <View style={styles.signatureBox}>
                        <Text style={styles.label}>
                            DIRECCIÓN DE TALENTO HUMANO
                        </Text>
                        <View style={styles.signatureLine} />
                        <Text style={styles.valuetwo}>Nombre y Firma</Text>
                    </View>
                </View>

                {/* Pie de Página */}
                <View style={styles.footer}>
                    <Text>
                        Documento generado electrónicamente el {currentDate} -
                        Válido sin firma autógrafa según Resolución N° 001-2024
                    </Text>
                    <Text>
                        Universidad de Margarita - Todos los derechos reservados
                    </Text>
                </View>
            </Page>
        </Document>
    )
}

export default SelectionResultPDF
