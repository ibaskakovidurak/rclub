import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/index.js'

const routes = [
    {
        path: '/',
        name: 'Index',
        components: {
            default: () => import('../views/Index.vue')
        },
        meta: {
            layout: 'Main',
            heading: 'Все рецензии',
            auth: true
        }
    },

    {
        path: '/my-reviews',
        name: 'UserPublications',
        components: {
            default: () => import('../views/UserPublications.vue')
        },
        meta: {
            layout: 'Main',
            heading: 'Мои рецензии',
            auth: true
        }
    },
    {
        path: '/add-review',
        name: 'AddReview',
        components: {
            default: () => import('../views/AddReview.vue')
        },
        meta: {
            layout: 'Main',
            heading: 'Добавить рецензию',
            auth: true
        }
    },
    {
        path: '/account',
        name: 'Account',
        components: {
            default: () => import('../views/Account.vue')
        },
        meta: {
            layout: 'Main',
            heading: 'Аккаунт',
            auth: true
        }
    },
    {
        path: '/auth',
        name: 'Auth',
        components: {
            default: () => import('../views/Auth.vue')
        },
        meta: {
            layout: 'Auth',
            heading: 'Авторизация',
            excluded: true
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        components: {
            default: () => import('../views/NotFound.vue')
        },
        meta: {
            layout: 'Main',
            heading: 'Страница не найдена',
            auth: true,
            excluded: true
        }
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    linkExactActiveClass: 'active',
    routes
})


router.beforeEach((to, from, next) => {
    document.title = `${import.meta.env.VITE_APP_NAME} | ${to.meta.heading}`
    if (to.meta.auth) {
        store.dispatch('auth/getAuthState').then(user => {
            if (user){
                next()
            } else {
                document.title = `${import.meta.env.VITE_APP_NAME} | Авторизация`
                next('/auth')
            }
        })
    } else {
        next()
    }
})

export default router