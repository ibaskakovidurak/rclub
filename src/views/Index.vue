<script setup>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import TheFilter from '../components/TheFilter.vue'
import ReviewsList from '../components/reviews/ReviewsList.vue'

const store = useStore()
const loading = computed(() => store.getters.loading)
const publications = computed(() => store.getters['review/publications'])
const showFilter = ref(false)

/**
 * Dispatching the async action to get all unfiltered publications from the DB
 *
 */
store.dispatch('review/getPublications', { payload: false })
    .then(_ => {
      store.commit('setLoading', false)
    })
    .catch(e => console.log(e))
</script>

<template>
  <div class="loading" v-if="loading"></div>
  <div class="main-content" id="content" v-else>
    <div class="sort-panel">
      <div class="container sort-panel__container">
        <div class="row sort-panel__row">
          <div class="sort-panel__left"><h1>Все рецензии</h1></div>
          <div class="sort-panel__right">
            <button type="button" class="btn btn--outline" @click="showFilter = !showFilter">Показать фильтр</button>
          </div>
        </div>
      </div>
    </div>
    <the-filter v-if="showFilter"></the-filter>
    <reviews-list :reviews="publications"></reviews-list>
  </div>
</template>