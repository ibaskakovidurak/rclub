<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
import Reviews from '../components/reviews/ReviewsList.vue'

const store = useStore()
const loading = computed(() => store.getters.loading)
const publications = computed(() => store.getters['review/publications'])

/**
 * Dispatching the async action to get all the user publications from the DB
 *
 */
store.dispatch('review/getPublications', { payload: true })
    .then(_ => store.commit('setLoading', false))
    .catch(e => console.log(e))
</script>

<template>
  <div class="loading" v-if="loading"></div>
  <div class="main-content" id="content" v-else>
    <div class="sort-panel">
      <div class="container sort-panel__container">
        <div class="row sort-panel__row">
          <div class="sort-panel__left"><h1>Мои рецензии</h1></div>
        </div>
      </div>
    </div>
    <reviews :reviews="publications" :editable="true" v-if="publications"></reviews>
  </div>
</template>
