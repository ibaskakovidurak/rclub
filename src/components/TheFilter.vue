<script setup>
  import { ref } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import { notification } from '../utils/notification.js'
  import { formFilter } from '../utils/form-filter.js'
  import FormFilter from './forms/FormFilter.vue'

  const store = useStore()
  const router = useRouter()
  const filter = ref(null)

  const { formSchema } = formFilter()

  /**
   * Filter(search) fn for the reviews
   *
   * @param $event
   * @param fieldsValues
   */
  const formSearch = ({ $event, fieldsValues }) => {
    filter.value = fieldsValues

    const btn = $event.target.querySelector('button[type="submit"]')

    btn.setAttribute('disabled', true)
    btn.textContent = 'Идет поиск...'

    store.dispatch('review/searchPublications', { filter: filter.value })
        .then(_ => {
          btn.removeAttribute('disabled')
          btn.textContent = 'Найти рецензию'
          store.commit('review/setLastSearch', true)
        })
        .catch(e => store.commit('setMessage', { message: notification(e.code), element: btn }))
  }
</script>

<template>
  <form-filter :schema="formSchema" @form-search="formSearch"></form-filter>
</template>

