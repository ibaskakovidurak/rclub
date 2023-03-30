import { firebaseApp } from '../../firebase/index.js'
import {
    doc,
    collection,
    updateDoc,
    getDocs,
    getFirestore,
    query,
    where
} from 'firebase/firestore'
import { getDownloadURL, uploadBytes, getStorage, ref } from 'firebase/storage'

const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

export default {
    namespaced: true,
    actions: {

        /**
         * Get user info from the DB
         *
         * @async
         * @param commit
         * @param dispatch
         * @param load
         * @return {Promise<*|null>}
         */
        async getUser ({ commit, dispatch }, load = true) {
            if (load) commit('setLoading', true, {root: true})
            try{
                const response = await dispatch('auth/getAuthState', null, {root: true})

                if (response) {
                    let userInfo;

                    const q = query(collection(db, 'users'), where('userID', '==', response.uid))
                    const data = await getDocs(q)

                    data.forEach(doc => {
                        userInfo = doc.data()
                        userInfo.docID = doc.id
                    })

                    userInfo.imageOld = userInfo.image
                    if (userInfo.image.length > 0) {
                        userInfo.image = await getDownloadURL(ref(storage, `images/${userInfo.image}`))
                    }
                    userInfo.email = response.email

                    return userInfo
                } else {
                    return null
                }
            } catch (e) {
                throw new Error(e)
            }
        },

        /**
         * Upload user image in to the Firebase Storage
         *
         * @async
         * @param _
         * @param file
         * @return {Promise}
         */
        async uploadImage (_, file) {
            try {
                const uniqueName = `${ new Date().getTime() }-${ file.name }`;
                const storageRef = ref(storage, `${import.meta.env.VITE_FB_STORAGE_BUCKET}images/${uniqueName}`);

                return await uploadBytes(storageRef, file)
            } catch (e) {
                throw new Error(e)
            }
        },

        /**
         * Update user info in the DB
         *
         * @async
         * @param commit
         * @param data
         * @return {Promise<void>}
         */
        async updateUser ({ commit }, data) {
            const { docID, userID, name, image: newImage, imageOld } = data
            const obj = {name, userID, image: newImage ? newImage: imageOld}
            const imagesRef = ref(storage, `images/${obj.image}`);

            try {
                const userImage = await getDownloadURL(imagesRef)

                const user = {
                    name: obj.name,
                    image: userImage
                }

                const queryMovies = query(collection(db, 'movies'), where('userID', '==', userID))
                const movies = await getDocs(queryMovies)


                for (const movie of movies.docs) {
                    const ref = doc(db, 'movies', movie.id)
                    await updateDoc(ref, {user: user})
                }

                const queryRates = query(collection(db, 'rates'), where('userID', '==', userID))
                const rates = await getDocs(queryRates)

                for (const rate of rates.docs) {
                    const ref = doc(db, 'rates', rate.id)
                    await updateDoc(ref, {user: user})
                }

                commit('auth/setAuthUser', true, {root: true})

                const ref = doc(db, 'users', docID)
                return await updateDoc(ref, obj)
            } catch (e) {
                commit('auth/setAuthUser', true, {root: true})
                throw new Error(e)
            }
        }
    }
}