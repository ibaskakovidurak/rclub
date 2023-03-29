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
        setAuthUser (state, payload) {
            state.isAuth = payload
        }
    },
    actions: {
        async getAuthState () {
            return new Promise((resolve, reject) => {
                onAuthStateChanged(auth,  async user => {
                    resolve(user !== null ? user : null)
                }, reject)
            })
        },
        async login (_, { email, password }) {
            return await signInWithEmailAndPassword(auth, email, password);
        },
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