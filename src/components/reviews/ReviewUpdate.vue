<script setup>
  import { ref } from 'vue'
  import { useStore } from 'vuex'
  import { addReview } from '../../utils/add-review.js'
  import { notification } from '../../utils/notification.js'
  import FormReviewUpdate from '../forms/FormReviewUpdate.vue'

  defineEmits(['close'])

  const props = defineProps({
    docID: {
      type: String,
      required: true
    }
  })

  const store = useStore()
  const scheme = ref(null)

  store.dispatch('review/getPublication', props.docID)
      .then(res => {
        const { formSchema } = addReview(res.data())
        scheme.value = formSchema
      })

  const updateCustom = ({ $event, fieldsValues }) => {
    const btn = $event.target.querySelector('button[type="submit"]')

    btn.setAttribute('disabled', true)

    fieldsValues.docID = props.docID

    store.dispatch('review/updateReview', fieldsValues)
        .then(_ => {
          scheme.value = null
          store.commit('setMessage', { message: notification('db/review-updated'), element: btn })
          store.dispatch('review/getPublications', { payload: true })
              .then(_ => store.commit('setLoading', false))
              .catch(e => console.log(e))
        })
  }
</script>

<template>
  <div class="overlay">
    <div class="modal modal--big">
      <div class="modal__close" @click="$emit('close')">&times;</div>
      <div class="modal__body">
        <div class="modal__title">Редактирование рецензии</div>
        <div class="modal__form" v-if="docID && scheme">
          <form-review-update :schema="scheme" @form-update="updateCustom"></form-review-update>
        </div>
      </div>
    </div>
  </div>
</template>