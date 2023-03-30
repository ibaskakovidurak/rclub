import { firebaseApp } from '../../firebase/index.js'
import {
    doc,
    collection,
    updateDoc,
    addDoc,
    getDocs,
    getFirestore,
    Timestamp,
    query,
    where
} from 'firebase/firestore'
import {notification} from "../../utils/notification.js";

const db = getFirestore(firebaseApp)

export default {
    namespaced: true,
    state () {

    },
    actions: {
        /**
         * Get all the rates of user reviews
         *
         * @param _
         * @param docID (not necessary yet)
         * @param userID
         * @return {Promise<{rates: *[]}>}
         */
        async getReviewRates (_, { docID, userID }) {
            try{
                const conditions = []

                conditions.push(where('docID', '==', docID))
                // conditions.push(where('userID', '==', userID))

                const q = query(collection(db, 'rates'), ...conditions)
                const data = await getDocs(q)
                const rates = []

                data.forEach(doc => {
                    const rate = doc.data()

                    rate.docID = doc.id
                    rates.push(rate)
                })

                return {
                    rates
                }
            } catch (e) {
                throw new Error(e)
            }
        },

        /**
         * Add rate for the another user review
         *
         * @async
         * @param dispatch
         * @param data
         * @return {Promise<DocumentReference<DocumentData>>}
         */
        async addRateReview ({ dispatch }, data) {
            try {
                const user = await dispatch('user/getUser', null, {root: true})

                data.userID = user.userID
                data.user = {
                    name: user.name,
                    image: user.image,
                }

                return await addDoc(collection(db, 'rates'), data)
            } catch (e) {
                throw new Error(e)
            }
        },

        /**
         * Update review (new feature, but not yet approved)
         *
         * @param commit
         * @param data
         * @return {Promise<void>}
         */
        async updateReview ({ commit }, data) {
            try {
                // const { review, merge } = data
                // const ref = doc(db, 'users', docID)
                // let obj = {name, userID, image: newImage ? newImage: imageOld}
                // return await updateDoc(ref, obj)
            } catch (e) {
                throw new Error(e)
            }
        }
    }
}