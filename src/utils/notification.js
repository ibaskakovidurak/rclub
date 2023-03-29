const respondTemplates = [
    {
        code: 'auth/too-many-requests',
        message: 'Вы совершили слишком много неудачных попыток входа. Попробуйте позднее',
        type: 'error'
    },
    {
        code: 'auth/user-not-found',
        message: 'Пользователь с таким логином не найден',
        type: 'error'
    },
    {
        code: 'auth/wrong-password',
        message: 'Вы ввели неправильный пароль',
        type: 'error'
    },
    {
        code: 'auth/sign-out',
        message: 'Вы вышли из своего аккаунта',
        type: 'info'
    },
    {
        code: 'storage/image-uploaded',
        message: 'Изображение загружено успешно!',
        type: 'success'
    },
    {
        code: 'db/review-rate-created',
        message: 'Ваша оценка фильма добавлена успешно!',
        type: 'success'
    },
    {
        code: 'db/review-deleted',
        message: 'Ваша рецензия был успешно удалена!',
        type: 'success'
    },
    {
        code: 'db/review-updated',
        message: 'Ваша рецензия была успешно обновлена!',
        type: 'success'
    },
    {
        code: 'db/review-created',
        message: 'Новая рецензия успешно добавлена!',
        type: 'success'
    },
    {
        code: 'db/data-updated-successful',
        message: 'Данные обновлены успешно!',
        type: 'success'
    }
]

const defaultRespond = {
    message: 'Неизвестная ошибка',
    type: 'error'
}

export function notification (code) {
    const notice = respondTemplates.find(el => el.code === code) || defaultRespond

    notice.id = Date.now() + (Math.random() * Math.random())

    return notice
}