<script setup>
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import { addReview } from '../utils/add-review.js'
  import { notification } from '../utils/notification.js'
  import FormAddReview from '../components/forms/FormAddReview.vue'

  const store = useStore()
  const router = useRouter()

  /**
   * Custom fn to add review
   * *
   * @param $event
   * @param fieldsValues
   * @param resetForm
   */
  const submitCustom = ({ $event, fieldsValues }, resetForm) => {
    const data = fieldsValues
    const btn = $event.target.querySelector('button[type="submit"]')

    btn.setAttribute('disabled', true)

    store.dispatch('review/addReview', data)
        .then( _ => {
          store.commit('setMessage', { message: notification('db/review-created'), element: btn })
          router.push('/my-reviews')
        })
        .catch(e => store.commit('setMessage', { message: notification(e.code), element: btn }))
  }

  const { formSchema } = addReview()
</script>

<template>
  <div class="main-content">
    <div class="sort-panel">
      <div class="container sort-panel__container">
        <div class="row sort-panel__row">
          <div class="sort-panel__left"><h1>Добавить рецензию</h1></div>
        </div>
      </div>
    </div>
    <form-add-review :schema="formSchema" @form-submit="submitCustom"></form-add-review>
  </div>
</template>