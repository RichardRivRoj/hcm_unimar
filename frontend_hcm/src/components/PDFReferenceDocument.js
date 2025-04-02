import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from '@react-pdf/renderer'
import { toast } from 'sonner'
import writtenNumber from 'written-number'

// Registrar fuente Arial (asegúrate de tener el archivo .ttf en /public/fonts)
Font.register({ family: 'Arial', src: '/fonts/ARIAL.TTF' })
Font.register({ family: 'Arial', src: '/fonts/ARIALNB.TTF' })

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Arial',
        fontSize: 12,
        lineHeight: 1.5,
        position: 'relative'
    },
    header: {
        textAlign: 'right',
        marginBottom: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    section: {
        marginBottom: 15,
        textAlign: 'justify'
    },
    bold: {
        fontWeight: 'bold'
    },
    signature: {
        marginTop: 40,
        textAlign: 'center',
        width: '100%'
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        textAlign: 'justify',
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 10
    },
    indent: {
        marginLeft: 30
    }
})

const PDFReferenceDocument = ({ reference }) => {
    // Función para parsear fechas del formato "DD-MM-AAAA HH:mm"
    const parseCustomDate = (dateString) => {
        if (!dateString) return new Date()
        
        const [datePart, timePart] = dateString.split(' ')
        const [day, month, year] = datePart.split('-')
        return new Date(`${year}-${month}-${day}T${timePart}`)
    }

    // Formateador de fechas seguro
    const safeFormatDate = (dateString) => {
        try {
            const date = parseCustomDate(dateString)
            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).replace(/\//g, ' de ')
        } catch (error) {
            toast.error('Error formateando fecha')
            return 'Fecha inválida'
        }
    }

    // Validar y obtener componentes de fecha
    const getValidDateComponents = (dateString) => {
        const date = parseCustomDate(dateString)
        return {
            day: date.getDate(),
            month: date.toLocaleString('es-ES', { month: 'long' }),
            year: date.getFullYear()
        }
    }

    // Obtener componentes de fecha validados
    const { day, month, year } = getValidDateComponents(reference.document_created_at)

    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                {/* Encabezado con fecha */}
                <Text style={styles.header}>
                    El Valle del Espíritu Santo, {safeFormatDate(reference.document_created_at)}
                </Text>

                {/* Destinatario */}
                <View style={styles.section}>
                    <Text>Señores:</Text>
                    <Text style={styles.bold}>
                        {process.env.NEXT_PUBLIC_COMPANY_NAME?.toUpperCase() || '[NOMBRE DE LA EMPRESA]'},
                    </Text>
                    <Text style={styles.bold}>
                        {reference.department_name?.toUpperCase() || '[NOMBRE DEL DEPARTAMENTO]'},
                    </Text>
                    <Text>Presente</Text>
                </View>

                {/* Título */}
                <View style={[styles.section, { textAlign: 'center' }]}>
                    <Text style={styles.bold}>REFERENCIA PERSONAL</Text>
                </View>

                {/* Cuerpo del documento */}
                <View style={[styles.section, styles.indent]}>
                    <Text>
                        Yo, <Text style={styles.bold}>{reference.referrer_name.toUpperCase()}</Text>, 
                        titular de la cédula de identidad No. {' '}
                        <Text style={styles.bold}>{reference.referrer_identification}</Text>, 
                        venezolana, mayor de edad, por medio de la presente hago constar que conozco 
                        de vista y trato al ciudadano/a{' '}
                        <Text style={styles.bold}>{reference.person.full_name.toUpperCase()}</Text>, 
                        cédula de identidad No. {' '}
                        <Text style={styles.bold}>
                            {reference.person.identification_type} - {reference.person.identification_value}
                        </Text>, desde hace{' '}
                        <Text style={styles.bold}>
                            {reference.years_known} ({writtenNumber(reference.years_known, { lang: 'es' })})
                        </Text> años, por lo que doy fe de ser una persona responsable y cumplidora de sus obligaciones.
                    </Text>
                </View>

                {/* Fecha y lugar */}
                <View style={[styles.section, styles.indent]}>
                    <Text>
                        Constancia que expido a petición de parte interesada, en El Valle a los{' '}
                        <Text style={styles.bold}>{day}</Text> días del mes de{' '}
                        <Text style={styles.bold}>{month}</Text> de{' '}
                        <Text style={styles.bold}>{year}</Text>.
                    </Text>
                </View>

                {/* Bloque de firma centrado */}
                <View style={styles.signature}>
                    <Text>Atentamente,</Text>
                    <Text style={{ marginTop: 20 }}>___________________________</Text>
                    <Text style={[styles.bold, { marginTop: 10 }]}>
                        {reference.referrer_name.toUpperCase()}
                    </Text>
                    <Text>C.I No. {reference.referrer_identification}</Text>
                </View>

                {/* Pie de página con dirección */}
                <View style={styles.footer}>
                    <Text style={{ textAlign: 'justify' }}>
                        Dirección: {process.env.NEXT_PUBLIC_COMPANY_ADDRESS}
                    </Text>
                </View>
            </Page>
        </Document>
    )
}

export default PDFReferenceDocument