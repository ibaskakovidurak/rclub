import * as yup from 'yup'

export function userAccountUpdate (fields) {

    const formSchema = {
        fields: [
            {
                label: 'Имя',
                name: 'name',
                as: 'input',
                value: fields.name,
                rules: yup.string()
                    .trim()
                    .required('Поле "имя" является обязательным')
                    .min(4, 'Имя не может быть меньше 4 символов')
            },
            {
                label: 'E-mail',
                name: 'email',
                as: 'input',
                value: fields.email,
                readonly: true,
                rules: yup.string()
                    .trim()
                    .required('Поле "email" является обязательным')
                    .email('Пожалуйста, введите корректный email')
            },
            {
                name: 'docID',
                as: 'input',
                value: fields.docID,
                hidden: true,
                rules: yup.string().trim().required()
            },
            {
                name: 'userID',
                as: 'input',
                value: fields.userID,
                hidden: true,
                rules: yup.string().trim().required()
            },
            {
                name: 'imageOld',
                as: 'input',
                value: fields.imageOld,
                hidden: true,
                rules: yup.string().trim()
            },
            {
                name: 'image',
                as: 'input',
                type: 'file',
                accept: ['image/*'],
                hidden: true,
                rules: yup.string().trim()
            }
        ]
    }

    return{
        formSchema
    }
}