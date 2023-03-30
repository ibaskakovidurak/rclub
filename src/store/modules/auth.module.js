import { firebaseApp } from '../../firebase/index.js'
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'

const auth = getAuth(firebaseApp)

export default {
    namespaced: true,
    state () {
        return {
            isAuth: null
        }
    },
    mutations: {
        /**
         * Setting auth user state
         *
         * @param state
         * @param payload
         */
        setAuthUser (state, payload) {
            state.isAuth = payload
        }
    },
    actions: {
        /**
         * Get user auth state from the Firebase
         *
         * @async
         * @return {Promise<unknown>}
         */
        async getAuthState () {
            return new Promise((resolve, reject) => {
                onAuthStateChanged(auth,  async user => {
                    resolve(user !== null ? user : null)
                }, reject)
            })
        },

        /**
         * Login in to the app using Firebase API
         *
         * @async
         * @param _
         * @param email
         * @param password
         * @return {Promise<UserCredential>}
         */
        async login (_, { email, password }) {
            return await signInWithEmailAndPassword(auth, email, password);
        },

        /**
         * Logout from the app using Firebase API
         *
         * @return {Promise<void>}
         */
        async logout () {
            return await signOut(auth)
        }
    },
    getters: {
        isAuth (state) {
            return state.isAuth
        }
    }
}