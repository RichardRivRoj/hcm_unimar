import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer'
import writtenNumber from 'written-number'

writtenNumber.defaults.lang = 'es'

const styles = StyleSheet.create({
    page: {
        padding: 40,
        position: 'relative',
        fontFamily: 'Times-Roman',
        lineHeight: 1.5
    },
    watermark: {
        position: 'absolute',
        opacity: 0.1,
        width: '80%',
        left: '10%',
        top: '30%'
    },
    header: {
        marginBottom: 20,
        textAlign: 'right',
        fontFamily: 'Times-Bold'
    },
    titlec: {
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Times-Bold'
    },
    refNumber: {
        fontSize: 10,
        marginBottom: 5
    },
    title: {
        fontSize: 14,
        textDecoration: 'underline',
        marginBottom: 15
    },
    bodyText: {
        fontSize: 12,
        textAlign: 'justify'
    },
    bold: {
        fontFamily: 'Times-Bold'
    },
    signature: {
        marginTop: 40,
        textAlign: 'center'
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 10
    }
})

const ConstanciaLaborPDF = ({ data }) => {
    const contrato = data.contratos?.[0] || {}
    const salario = contrato.posicion?.salario || { monto: 0, moneda: 'VES' }
    const fechaIngreso = contrato.fecha_inicio ? 
        new Date(contrato.fecha_inicio) : 
        new Date()

    const directorRH = process.env.NEXT_PUBLIC_DIRECTOR_RH || 'Esp. Sujey Avane'
    const cedulaDirector = process.env.NEXT_PUBLIC_CEDULA_DIRECTOR || 'V-XXXXXXXX'
    const lugarEmision = process.env.NEXT_PUBLIC_LUGAR_EMISION || 'El Valle del Espíritu Santo'

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Image 
                    src="/logo-1.png" 
                    style={styles.watermark} 
                />

                <View style={styles.header}>
                    <Text style={styles.refNumber}>DRH. -{new Date().getFullYear()}-{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}</Text>
                </View>

                <View style={styles.bodyText}>
                    <Text style={styles.titlec}>CONSTANCIA DE TRABAJO</Text>
                    <Text>
                        Quien suscribe, {directorRH}, titular de la cédula de identidad Nro. {cedulaDirector}, 
                        Director(a) de la Dirección de Talento Humano de la {' '}
                        {process.env.NEXT_PUBLIC_NOMBRE_EMPRESA || '[NOMBRE DE LA INSTITUCIÓN]'}, hago constar que:
                    </Text>

                    <Text style={{ marginTop: 15 }}>
                        El (la) ciudadano(a) {' '}
                        <Text style={styles.bold}>
                            {data.personal_info?.nombre_completo?.toUpperCase() || '[NOMBRE COMPLETO]'}, {' '}
                        </Text>
                        titular de la cédula de identidad Nro.{' '}
                        <Text style={styles.bold}>
                            {data.personal_info?.identificacion?.tipo || 'V'}-{data.personal_info?.identificacion?.numero || 'XXXXXXXX'}
                        </Text>, presta sus servicios para esta Institución, desempeñándose actualmente como {' '}
                        <Text style={styles.bold}>
                            {contrato.posicion?.nombre?.toUpperCase() || '[PUESTO ACTUAL]'}, 
                        </Text> desde el {' '}
                        <Text style={styles.bold}>
                            {writtenNumber(fechaIngreso.getDate(), { lang: 'es' }).toUpperCase()} (
                            {fechaIngreso.getDate().toString().padStart(2, '0')}) de {
                            fechaIngreso.toLocaleDateString('es-VE', { month: 'long' }).toUpperCase()} de {
                            fechaIngreso.getFullYear()}, 
                        </Text>
                        {' '} devengando un salario promedio mensual de {' '}
                        <Text style={styles.bold}>
                            {writtenNumber(parseFloat(salario.monto), { lang: 'es' }).toUpperCase()} BOLÍVARES CON {
                            (salario.monto % 1).toFixed(2).split('.')[1] || '00'}/100 CÉNTIMOS (Bs. {
                            parseFloat(salario.monto).toLocaleString('es-VE')}).
                        </Text>
                    </Text>

                    <Text style={{ marginTop: 15 }}>
                        Constancia que se expide a petición de la parte interesada, en {lugarEmision}, 
                        a los {writtenNumber(new Date().getDate(), { lang: 'es' }).toUpperCase()} días del mes de {
                        new Date().toLocaleDateString('es-VE', { month: 'long' }).toUpperCase()} de {
                        new Date().getFullYear()}.
                    </Text>
                </View>

                <View style={styles.signature}>
                    <Text style={{ marginTop: 30 }}>Atentamente,</Text>
                    <Text style={{ marginTop: 40 }}>_________________________</Text>
                    <Text style={{fontSize: 12}}>{directorRH}</Text>
                    <Text style={{fontSize: 12}}>Director de Talento Humano</Text>
                    <Text style={{fontSize: 12}}>{process.env.NEXT_PUBLIC_NOMBRE_EMPRESA || '[NOMBRE DE LA INSTITUCIÓN]'}</Text>
                </View>

                <View style={styles.footer}>
                    <Text>
                        {process.env.NEXT_PUBLIC_COMPANY_ADDRESS || '[Dirección Completa de la Institución]'} | 
                        Teléfono: {process.env.NEXT_PUBLIC_PHONE_COMPANY || '[XXX-XXXXXXX]'}
                    </Text>
                </View>
            </Page>
        </Document>
    )
}

export default ConstanciaLaborPDF