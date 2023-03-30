import { createStore } from 'vuex'
import authModule from './modules/auth.module.js'
import userModule from './modules/user.module.js'
import reviewModule from './modules/review.module.js'
import rateModule from './modules/rate.module.js'

export default createStore({
    modules: {
        auth: authModule,
        user: userModule,
        review: reviewModule,
        rate: rateModule
    },
    state () {
        return {
            loading: true,
            messages: []
        }
    },
    mutations: {
        /**
         * Set message for the Toster Notifications
         *
         * @param state
         * @param message
         * @param element
         */
        setMessage (state, {message, element}) {
            state.messages.push(message)

            if (element) element.removeAttribute('disabled')

            setTimeout(() => {
                const idx = state.messages.findIndex(m => m.id === message.id)
                state.messages.splice(idx, 1)
                if(state.messages.length === 0) state.notification = false
            }, 4000)
        },

        /**
         * Set loading state before/between getting the request, updating, etc.
         *
         * @param state
         * @param payload
         */
        setLoading (state, payload) {
            state.loading = payload
        }
    },
    getters: {
        messages (state) {
            return state.messages
        },
        loading (state) {
            return state.loading
        }
    }
})
