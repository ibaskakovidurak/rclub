import * as yup from 'yup'

export function formFilter () {

    const formSchema = {
        fields: [
            {
                label: 'Год',
                name: 'yearStart',
                as: 'input',
                type: 'number',
                value: 1960,
                placeholder: 'Формат: ХХХХ',
                rules: yup.number()
                    .required('Поле "Год" является обязательным')
            },
            {
                label: 'Год',
                name: 'yearEnd',
                as: 'input',
                type: 'number',
                value: new Date().getUTCFullYear(),
                placeholder: 'Формат: ХХХХ',
                rules: yup.number()
                    .required('Поле "Год" является обязательным')
            },
            {
                label: 'Тип',
                name: 'type',
                as: 'select',
                value: 'Фильм',
                children: [
                    {
                        tag: 'option',
                        text: 'Фильм',
                        value: 'Фильм'
                    },
                    {
                        tag: 'option',
                        text: 'Сериал',
                        value: 'Сериал'
                    },
                    {
                        tag: 'option',
                        text: 'Передача',
                        value: 'Передача'
                    },
                    {
                        tag: 'option',
                        text: 'Шоу',
                        value: 'Шоу'
                    }
                ]
            },
            {
                label: 'Жанр',
                name: 'genre',
                as: 'select',
                multiple: true,
                children: [
                    {
                        tag: 'option',
                        text: 'Боевик',
                        value: 'Боевик'
                    },
                    {
                        tag: 'option',
                        text: 'Детектив',
                        value: 'Детектив'
                    },
                    {
                        tag: 'option',
                        text: 'Драма',
                        value: 'Драма'
                    },
                    {
                        tag: 'option',
                        text: 'Исторический фильм',
                        value: 'Исторический фильм'
                    },
                    {
                        tag: 'option',
                        text: 'Комедия',
                        value: 'Комедия'
                    },
                    {
                        tag: 'option',
                        text: 'Мелодрама',
                        value: 'Мелодрама'
                    },
                    {
                        tag: 'option',
                        text: 'Музыка',
                        value: 'Музыка'
                    },
                    {
                        tag: 'option',
                        text: 'Нуар',
                        value: 'Нуар'
                    },
                    {
                        tag: 'option',
                        text: 'Политика',
                        value: 'Политика'
                    },
                    {
                        tag: 'option',
                        text: 'Сказка',
                        value: 'Сказка'
                    },
                    {
                        tag: 'option',
                        text: 'Трагедия',
                        value: 'Трагедия'
                    },
                    {
                        tag: 'option',
                        text: 'Триллер',
                        value: 'Триллер'
                    },
                    {
                        tag: 'option',
                        text: 'Фантастика',
                        value: 'Фантастика'
                    },
                    {
                        tag: 'option',
                        text: 'Фильм-катастрофа',
                        value: 'Фильм-катастрофа'
                    },
                    {
                        tag: 'option',
                        text: 'Ужасы',
                        value: 'Ужасы'
                    }
                ]
            }
        ]
    }

    return{
        formSchema
    }
}