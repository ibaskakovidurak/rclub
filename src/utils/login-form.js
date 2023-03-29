import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

export function loginForm (fn) {
    const { handleSubmit, isSubmitting } = useForm()

    const { value: email, errorMessage: eError, handleBlur: eBlur } = useField(
        'email',
        yup
            .string()
            .trim()
            .required('Поле "email" является обязательным')
            .email('Пожалуйста, введите корректный email')
    )

    const { value: password, errorMessage: pError, handleBlur: pBlur } = useField(
        'password',
        yup
            .string()
            .trim()
            .required('Поле "пароль" является обязательным')
            .min(6, 'Пароль не может быть меньше 6 символов')
    )

    const onSubmit = handleSubmit(fn)

    return {
        email,
        eError,
        eBlur,
        password,
        pError,
        pBlur,
        onSubmit,
        isSubmitting
    }
}