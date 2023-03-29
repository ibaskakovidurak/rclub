import * as yup from 'yup'

export function addReview (fieldsValues = null) {

    const rate = []

    for (let i = 1; i < 11; i++) rate.push({ tag: 'option', text: i, value: i })

    const genres = [
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

    if (fieldsValues) {
        const genreIndex = genres.findIndex(g => fieldsValues.genre.find(f => g.value === f))

        genres[genreIndex].selected = true
    }

    const formSchema = {
        fields: [
            {
                label: 'Название',
                name: 'name',
                as: 'input',
                grid: 'a',
                value: fieldsValues ? fieldsValues.name : '',
                placeholder: 'Введите название',
                rules: yup.string()
                    .trim()
                    .required('Поле "Название" является обязательным')
                    .min(4, 'Название не может быть меньше 4 символов')
            },
            {
                label: 'Год',
                name: 'year',
                as: 'input',
                grid: 'b',
                type: 'number',
                value: fieldsValues ? fieldsValues.year : new Date().getUTCFullYear(),
                placeholder: 'Формат: ХХХХ',
                rules: yup.number()
                    .required('Поле "Год" является обязательным')
            },
            {
                label: 'Оценка',
                name: 'rate',
                as: 'select',
                grid: 'c',
                value: fieldsValues ? fieldsValues.rate : 1,
                children: rate
            },
            {
                label: 'Тип',
                name: 'type',
                as: 'select',
                grid: 'd',
                value: fieldsValues ? fieldsValues.type : 'Фильм',
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
                grid: 'e',
                children: genres
            },
            {
                label: 'Ссылка на кинопоиск',
                name: 'kp_link',
                as: 'input',
                grid: 'f',
                type: 'url',
                value: fieldsValues ? fieldsValues.kp_link : '',
                placeholder: 'Формат: https://ваша-ссылка.чего-то',
                rules: yup.string()
                    .required('Поле "Ссылка на кинопоиск" является обязательным')
            },
            {
                label: 'Ссылка на просмотр',
                name: 'watch_link',
                as: 'input',
                grid: 'g',
                type: 'url',
                value: fieldsValues ? fieldsValues.watch_link : '',
                placeholder: 'Формат: https://ваша-ссылка.чего-то',
                rules: yup.string()
                    .required('Поле "Ссылка на просмотр" является обязательным')
            },
            {
                label: 'Рецензия',
                name: 'description',
                as: 'textarea',
                grid: 'h',
                value: fieldsValues ? fieldsValues.description : '',
                placeholder: 'Напишите вашу рецензию на фильм',
                rules: yup.string()
                    .required('Поле "Рецензия" является обязательным')
                    .min(30, 'Вы должны написать не менее 30 символов')
            }
        ]
    }

    if (fieldsValues && fieldsValues.userID) {
        formSchema.fields.push({
            label: '',
            name: 'userID',
            as: 'input',
            type: 'hidden',
            value: fieldsValues.userID,
            rules: yup.string()
                .required('Поле "Ссылка на просмотр" является обязательным')
        })
    }

    return{
        formSchema
    }
}