import * as yup from 'yup'

export function addReviewRate (docID) {

    const rate = []

    for (let i = 1; i < 11; i++) rate.push({ tag: 'option', text: i, value: i })

    const formSchema = {
        fields: [
            {
                label: 'Оценка',
                name: 'rate',
                as: 'select',
                grid: 'c',
                value: 1,
                children: rate
            },
            {
                label: 'Рецензия',
                name: 'description',
                as: 'textarea',
                grid: 'h',
                placeholder: 'Напишите вашу рецензию на фильм',
                rules: yup.string()
                    .required('Поле "Рецензия" является обязательным')
                    .min(30, 'Вы должны написать не менее 30 символов')
            },
            {
                name: 'docID',
                as: 'input',
                value: docID,
                hidden: true,
                rules: yup.string().trim().required()
            }
        ]
    }

    return{
        formSchema
    }
}