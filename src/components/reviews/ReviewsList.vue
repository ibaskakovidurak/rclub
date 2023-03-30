<script setup>
  import { computed, ref } from 'vue'
  import { useStore } from 'vuex'
  import ReviewRate from './ReviewRate.vue'
  import ReviewUpdate from './ReviewUpdate.vue'
  import ReviewRateList from './ReviewRateList.vue'
  import ReviewRating from './ReviewRating.vue'
  import { notification } from '../../utils/notification.js'

  const props = defineProps({
    reviews: {
      type: Array,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    }
  })

  const store = useStore()
  const last = computed(() => store.getters['review/last'])
  const filter = computed(() => store.getters['review/filter'])
  const lastSearch = computed(() => store.getters['review/lastSearch'])
  const rateData = ref('')
  const showReviews = ref(false)
  const edit = ref('')

  const rateMovie = docID => rateData.value = docID

  const openUpdateModal = docID => edit.value = docID

  /**
   * Delete fn to remove review from the DB
   *
   * @param docID
   * @param e
   */
  const deleteReview = (docID, e) => {
    if (confirm('Вы уверены?')) {
      const btn = e.target

      btn.setAttribute('disabled', true)

      store.dispatch('review/deleteReview', docID)
          .then(_ => {
            store.commit('setMessage', { message: notification('db/review-deleted'), element: btn })
            store.dispatch('review/getPublications', true)
                .then(_ => store.commit('setLoading', false))
                .catch(e => console.log(e))
          })
    }
  }

  /**
   * Fn to upload next 10 publications from the DB (async pagination)
   *
   * @param e
   */
  const getNext = (e) => {
    const btn = e.target
    const type = lastSearch.value ? 'review/searchPublications' : 'review/getPublications'

    btn.textContent = 'Загрузка...'
    btn.setAttribute('disabled', true)

    store.dispatch(type, { payload: props.editable, last: last.value, filter: filter.value })
        .then(res => {
          if (res) {
            btn.textContent = 'Показать еще'
            btn.removeAttribute('disabled')
          } else {
            btn.textContent = 'Вы просмотрели все рецензии'
          }
        })
        .catch(e => console.log(e))
  }
</script>

<template>
  <div v-for="review in reviews" class="review" :key="review.docID" v-if="reviews.length > 0">
    <div class="review__left">
      <div :title="review.user.name" class="review__author-image">
        <img :src="review.user.image" v-if="review.user.image.length > 0">
        <span class="review__author-image review__author-name" v-else>{{ review.user.name[0] }}</span>
      </div>
    </div>
    <div class="review__data">
      <div class="review__right">
        <div class="row review__row-rate">
          <review-rating :rate="review.rate" :user-rates="review.rates"></review-rating>
          <div class="review__buttons-group">
            <span
                class="btn btn--outline btn--badge"
                v-if="review.currentUserID === review.userID || review.rates.find(r => r.userID === review.currentUserID )"
            >
              Оценка добавлена
            </span>
            <button
                type="button"
                class="btn"
                v-else-if="review.currentUserID !== review.userID"
                @click="rateMovie(review.docID)"
            >
              Оценить фильм
            </button>
          </div>
          <div class="review__users" v-if="review.rates.length > 0">
            <div class="review__user-item-img" v-for="(rate, idx) in review.rates" :key="idx">
              <img :src="rate.user.image" v-if="rate.user.image">
              <span v-else>{{ rate.user.name[0] }}</span>
            </div>
          </div>
        </div>
        <div class="row review__row-film-data">
          <div class="review__film-info review__film-info_left">
            <div class="review__film-title">{{ review.name }}</div>
            <div class="review__film-year">Год: {{ review.year }}</div>
            <div class="review__film-type">Тип: {{ review.type }}</div>
            <div class="review__film-genre">
              Жанр:
              <span v-for="(genre, idx) in review.genre" :key="idx">{{ genre }}</span>
            </div>
          </div>
          <div class="review__film-info review__film-info_right">
            <div class="review__film-publish-date">Опубликовано: {{ new Date(review.created_at.seconds * 1000).toLocaleDateString('ru-RU') }}</div>
            <div class="review__film-link-info">
              <a class="btn btn--outline" :href="review.kp_link">Кинопоиск</a>
            </div>
            <div class="review__film-link-watch">
              <a class="btn btn--outline" :href="review.watch_link">Смотреть</a>
            </div>
          </div>
        </div>
        <div class="row review__row-reviews">
          <div class="review__user-review --first">
            <div class="review__user-text">
              <div>
                {{ review.description }}
                <span class="review__user-rate">
                  <span class="review__user-rate-desc">{{ review.rate }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 5.256A8.148 8.148 0 0 0 12 5a9.04 9.04 0 0 0-2 .227M20.098 10c.572 1.068.902 2.24.902 3.444C21 17.89 16.97 21 12 21s-9-3-9-7.556c0-1.251.288-2.41.792-3.444"></path><path d="M3.75 10S2.11 3.58 3.5 3C4.89 2.42 8 3 9.781 5"></path><path d="M20.172 10.002s1.64-6.42.25-7c-1.39-.58-4.5 0-6.282 2"></path><path d="M8 14v.5"></path><path d="M16 14v.5"></path><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"></path></svg>
                </span>
              </div>
            </div>
          </div>
          <div class="review__user-review-show-all" v-if="review.rates.length > 0">
            <button type="button" class="btn btn--link" @click="showReviews = !showReviews">{{ showReviews ? 'Скрыть' : 'Показать' }} все оценки</button>
          </div>
          <review-rate-list :rates="review.rates" :current-user="review.currentUserID" v-if="review.rates.length > 0 && showReviews"></review-rate-list>
        </div>
      </div>
    </div>
    <div class="review__edit" v-if="editable && review.currentUserID === review.userID">
      <button type="button" class="btn btn--action" @click="openUpdateModal(review.docID)">Редактировать</button>
      <button type="button" class="btn btn--delete" @click="deleteReview(review.docID, $event)">Удалить</button>
    </div>
  </div>
  <div v-else>Empty...</div>
  <div class="reviews-next" v-if="reviews.length > 0 && !lastSearch">
    <button class="btn btn--big" type="button" @click="getNext($event)">Показать еще</button>
  </div>
  <teleport to="body" v-if="rateData.length > 0">
    <review-rate :docID="rateData" @close="rateData = ''"></review-rate>
  </teleport>
  <teleport to="body" v-if="edit">
    <review-update :docID="edit" @close="edit = ''"></review-update>
  </teleport>
</template>