import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()
    const params = useParams()

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }) => {
        await csrf()

        setErrors([])

        axios
            .post('/register', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/login', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf(); // Asegúrate de que el token CSRF esté configurado
    
        setErrors([]); // Limpia los errores anteriores
        setStatus(null); // Limpia el estado anterior
    
        try {
            const response = await axios.post('/forgot-password', { email });
            setStatus(response.data.status); // Establece el estado con la respuesta del servidor
        } catch (error) {
            if (error.response) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                if (error.response.status === 422) {
                    // Errores de validación (por ejemplo, campos incorrectos)
                    setErrors(error.response.data.errors);
                } else {
                    // Otros errores del servidor (por ejemplo, 500)
                    setStatus('Algo salió mal. Por favor, inténtalo de nuevo más tarde.');
                }
            } else if (error.request) {
                // La solicitud fue hecha pero no se recibió respuesta
                setStatus('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
            } else {
                // Otros errores (por ejemplo, errores en la configuración de Axios)
                setStatus('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
            }
        }
    };

    const resetPassword = async ({ email, password, password_confirmation, token, setErrors, setStatus }) => {
        await csrf(); // Asegúrate de que el token CSRF esté configurado
    
        setErrors([]);
        setStatus(null);
    
        try {
            const response = await axios.post('/reset-password', {
                token,
                email,
                password,
                password_confirmation,
            });
    
            setStatus(response.data.status); // Establece el estado con la respuesta del servidor
        } catch (error) {
            if (error.response) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                if (error.response.status === 422) {
                    // Errores de validación (por ejemplo, campos incorrectos)
                    setErrors(error.response.data.errors);
                } else {
                    // Otros errores del servidor (por ejemplo, 500)
                    setStatus('Algo salió mal. Por favor, inténtalo de nuevo más tarde.');
                }
            } else if (error.request) {
                // La solicitud fue hecha pero no se recibió respuesta
                setStatus('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
            } else {
                // Otros errores (por ejemplo, errores en la configuración de Axios)
                setStatus('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
            }
        }
    };

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/login'
    }

    const updatePassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/update-password', props)
            .then(response => setStatus('password-updated'))
            .catch(error => {
                if (error.response.status === 422) {
                    setErrors(Object.values(error.response.data.errors).flat())
                } else {
                    throw error
                }
            })
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)

        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
        updatePassword,
    }
}
