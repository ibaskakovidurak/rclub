<script setup>
  import { useStore } from 'vuex'
  import { addReviewRate } from '../../utils/add-review-rate.js'
  import { notification } from '../../utils/notification.js'
  import FormReviewRate from '../forms/FormReviewRate.vue'

  defineEmits(['close'])

  const props = defineProps({
    docID: {
      type: String,
      required: true
    }
  })

  const store = useStore()

  const { formSchema } = addReviewRate(props.docID)
  const submitCustom = ({ $event, fieldsValues }) => {
    const btn = $event.target.querySelector('button[type="submit"]')

    btn.setAttribute('disabled', true)

    store.dispatch('rate/addRateReview', fieldsValues)
        .then( _ => {
          store.commit('setMessage', { message: notification('db/review-rate-created'), element: btn })
          store.dispatch('review/getPublications')
              .then(_ => store.commit('setLoading', false))
              .catch(e => console.log(e))
        })
        .catch(e => {
          console.log(e)
          store.commit('setMessage', { message: notification(e.code), element: btn })
        })
  }
</script>

<template>
  <div class="overlay">
    <div class="modal">
      <div class="modal__close" @click="$emit('close')">&times;</div>
      <div class="modal__body">
        <div class="modal__title">Добавить оценку</div>
        <div class="modal__form">
          <form-review-rate :schema="formSchema" @form-submit="submitCustom"></form-review-rate>
        </div>
      </div>
    </div>
  </div>
</template>