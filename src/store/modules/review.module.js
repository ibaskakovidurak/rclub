import { firebaseApp } from '../../firebase/index.js'
import {
    doc,
    collection,
    deleteDoc,
    updateDoc,
    addDoc,
    getDoc,
    getDocs,
    getFirestore,
    Timestamp,
    startAfter,
    orderBy,
    limit,
    query,
    where
} from 'firebase/firestore'

const db = getFirestore(firebaseApp)

export default {
    namespaced: true,
    store () {
        return {
            filter: null,
            lastSearch: null,
            last: null,
            publications: []
        }
    },
    mutations: {
        /**
         * Set review publications
         *
         * @param state
         * @param payload
         */
        setPublications (state, payload) {
            state.publications = payload
        },

        /**
         * Push a new review
         *
         * @param state
         * @param payload
         */
        pushToPublications (state, payload) {
            state.publications.push(payload)
        },

        /**
         * Set filter for the all reviews
         *
         * @param state
         * @param payload
         */
        setFilter (state, payload) {
            state.filter = payload
        },

        /**
         * Set the last review in the query for the pagination
         *
         * @param state
         * @param payload
         */
        setLast (state, payload) {
            state.last = payload
        },

        /**
         * Set the last review in the query for the pagination in the filter (not approved yet)
         *
         * @param state
         * @param payload
         */
        setLastSearch (state, payload) {
            state.lastSearch = payload
        }
    },
    actions: {

        /**
         * Get one review from the DB by docID
         *
         * @async
         * @param _
         * @param docID
         * @return {Promise<DocumentSnapshot<DocumentData>>}
         */
        async getPublication (_, docID) {
            try{
                const docRef = doc(db, 'movies', docID);
                return await getDoc(docRef);
            } catch (e) {
                throw new Error(e)
            }
        },

        /**
         * Search for user reviews in the DB by the filter
         *
         * @async
         * @param commit
         * @param dispatch
         * @param payload
         * @return {Promise<boolean>}
         */
        async searchPublications ({ commit, dispatch }, payload) {
            try{
                const publications = []
                const user = await dispatch('user/getUser', null, {root: true})
                const filter = payload.filter

                commit('setFilter', filter)

                console.log(payload.last)

                const q = payload.genre
                    ? query(
                        collection(db, 'movies'),
                        where('type', '==', filter.type),
                        where('year', '<=', parseInt(filter.yearEnd)),
                        where('year', '>=', parseInt(filter.yearStart)),
                        orderBy('created_at', 'desc'),
                        startAfter(payload.last),
                        limit(30)
                    )
                    : query(
                        collection(db, 'movies'),
                        where('type', '==', filter.type),
                        where('year', '<=', parseInt(filter.yearEnd)),
                        where('year', '>=', parseInt(filter.yearStart)),
                        orderBy('year', 'desc'),
                        orderBy('created_at', 'desc'),
                        limit(30)
                    )

                const data = await getDocs(q)

                for (const doc of data.docs) {
                    const publication = doc.data()

                    publication.docID = doc.id
                    publication.rates = []
                    publication.currentUserID = user.userID

                    const ratesData = await dispatch('rate/getReviewRates', {
                        docID: publication.docID,
                        userID: publication.userID
                    }, { root: true })

                    if (ratesData.rates.length > 0) ratesData.rates.forEach(rate => publication.rates.push(rate))

                    if (filter.genre) {
                        if (!!publication.genre.find(g => filter.genre.some(f => f === g))) {
                            publications.push(publication)
                            if (payload.last) commit('pushToPublications', publication)
                        }
                    } else {
                        publications.push(publication)
                        if (payload.last) commit('pushToPublications', publication)
                    }
                }

                commit('setLast', data.docs[data.docs.length - 1])

                if (!payload.last) {
                    commit('setPublications', publications)
                }

                return !!publications.length
            } catch (e) {
                throw new Error(e)
            }
        },

        /**
         * Get all user reviews from the DB
         *
         * @async
         * @param commit
         * @param dispatch
         * @param payloadObject
         * @return {Promise<boolean>}
         */
        async getPublications ({ commit, dispatch }, payloadObject) {
            if (!payloadObject.last) {
                commit('setLoading', true, {root: true})
                commit('setPublications', [])
            }
            try{
                const publications = []
                const user = await dispatch('user/getUser', null, {root: true})

                let q = payloadObject.payload
                    ? query(
                        collection(db, 'movies'),
                        where('userID', '==', user.userID),
                        orderBy('created_at', 'desc'),
                        limit(import.meta.env.VITE_REVIEW_LIMIT)
                    )
                    : query(
                        collection(db, 'movies'),
                        orderBy('created_at', 'desc'),
                        limit(import.meta.env.VITE_REVIEW_LIMIT)
                    )

                if (payloadObject.last) {
                    q = payloadObject.payload
                        ? query(
                            collection(db, 'movies'),
                            where('userID', '==', user.userID),
                            orderBy('created_at', 'desc'),
                            startAfter(payloadObject.last),
                            limit(import.meta.env.VITE_REVIEW_LIMIT)
                        )
                        : query(
                            collection(db, 'movies'),
                            orderBy('created_at', 'desc'),
                            startAfter(payloadObject.last),
                            limit(import.meta.env.VITE_REVIEW_LIMIT)
                        )
                }

                const data = await getDocs(q)

                for (const doc of data.docs) {
                    const publication = doc.data()

                    publication.docID = doc.id
                    publication.rates = []
                    publication.currentUserID = user.userID

                    const ratesData = await dispatch('rate/getReviewRates', {
                        docID: publication.docID,
                        userID: publication.userID
                    }, { root: true })

                    if (ratesData.rates.length > 0) ratesData.rates.forEach(rate => publication.rates.push(rate))

                    publications.push(publication)

                    if (payloadObject.last) commit('pushToPublications', publication)
                }

                commit('setLast', data.docs[data.docs.length - 1])

                if (!payloadObject.last) {
                    commit('setPublications', publications)
                }

                return !!publications.length
            } catch (e) {
                throw new Error(e)
            }
        },

        /**
         * Add user review to the DB
         *
         * @async
         * @param dispatch
         * @param data
         * @return {Promise<DocumentReference<DocumentData>>}
         */
        async addReview ({ dispatch }, data) {
            try {
                const user = await dispatch('user/getUser', null, {root: true})

                data.userID = user.userID
                data.user = {
                    name: user.name,
                    image: user.image
                }
                data.reviews = []
                data.created_at = Timestamp.fromDate(new Date())

                return await addDoc(collection(db, 'movies'), data)
            } catch (e) {
                throw new Error(e)
            }
        },

        /**
         * Update a user review in the DB by userID & docID
         *
         * @async
         * @param commit
         * @param dispatch
         * @param data
         * @return {Promise<void>}
         */
        async updateReview ({ commit,dispatch }, data) {
            try {
                const reviewRequestData = {...data}
                const publication = await dispatch('getPublication', reviewRequestData.docID)

                const review = publication.data()

                console.log(review)

                if (review && review.userID ===  reviewRequestData.userID) {
                    const ref = doc(db, 'movies', publication.id)
                    return await updateDoc(ref, reviewRequestData)
                } else {
                    throw new Error('No data...')
                }
            } catch (e) {
                throw new Error(e)
            }
        },

        /**
         * Delete user review & review rates from the DB by docID
         *
         * @async
         * @param dispatch
         * @param docID
         * @return {Promise<void>}
         */
        async deleteReview ({ dispatch }, docID) {
            const q = query(collection(db, 'rates'), where('docID', '==', docID))
            const rates = await getDocs(q)

            if (rates.docs.length > 0) {
                for (const rate of rates.docs) {
                    await deleteDoc(doc(db, 'rates', rate.id));
                }
            }

            return await deleteDoc(doc(db, 'movies', docID));
        }
    },
    getters: {
        publications (state) {
            return state.publications
        },
        last (state) {
            return state.last
        },
        lastSearch (state) {
            return state.lastSearch
        },
        filter (state) {
            return state.filter
        }
    }
}