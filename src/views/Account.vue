<script setup>
  import { computed, ref } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import { userAccountUpdate } from '../utils/user-account-update.js'
  import { chooseImage } from '../utils/choose-image.js'
  import FormAccountUpdate from '../components/forms/FormAccountUpdate.vue'
  import { notification } from "../utils/notification.js";

  const store = useStore()
  const router = useRouter()
  const loading = computed(() => store.getters.loading)
  const name = ref('')
  const imageLink = ref('')
  const schema = ref(null)

  /**
   * Dispatching async action to get user info
   */
  store.dispatch('user/getUser').then(res => {
    const fields = {
      imageOld: res.imageOld,
      name: res.name,
      email: res.email,
      docID: res.docID,
      userID: res.userID
    }

    name.value = res.name
    imageLink.value = res.image

    const { formSchema } = userAccountUpdate(fields)

    schema.value = formSchema

    store.commit('setLoading', false)
  })

  /**
   * Custom fn to update user account
   *
   * @param $event
   * @param values
   */
  const submitCustom = ({$event, fieldsValues: values}) => {
    const btn = $event.target.querySelector('button[type="submit"]')

    btn.setAttribute('disabled', true)
    name.value = values.name
    store.commit('auth/setAuthUser', false, {root: true})

    if (values.image) {
      store.dispatch('user/uploadImage', values.image)
          .then( snapshot => {
            store.commit('setMessage', { message: notification('storage/image-uploaded') })
            values.image = snapshot.metadata.name
            store.dispatch('user/updateUser', values)
                .then( _ => store.commit('setMessage', { message: notification('db/data-updated-successful'), element: btn }))
                .catch(e => store.commit('setMessage', { message: notification(e.code), element: btn }))
          })
          .catch(e => store.commit('setMessage', { message: notification(e.code), element: btn }))
    } else {
      store.dispatch('user/updateUser', values)
          .then( _ => store.commit('setMessage', { message: notification('db/data-updated-successful'), element: btn }))
          .catch(e => store.commit('setMessage', { message: notification(e.code), element: btn }))
    }
  }


  /**
   * Logout from the app
   */
  const logout = () => {
    store.dispatch('auth/logout')
    store.commit('auth/setAuthUser', false)
    router.push('/auth')
  }
</script>

<template>
  <div class="loading" v-if="loading && !schema"></div>
  <div class="main-content" v-else>
    <div class="sort-panel">
      <div class="container sort-panel__container">
        <div class="row sort-panel__row">
          <div class="sort-panel__left"><h1>Аккаунт</h1></div>
          <div class="sort-panel__right">
            <button class="btn btn--default btn--sign-out" type="button" @click="logout">Выйти</button>
          </div>
        </div>
      </div>
    </div>
    <div class="account">
      <div class="account__left">
        <div class="account__image-container">
          <img class="account__image" :src="imageLink" v-if="imageLink.length > 0">
          <div class="account__name">{{ name[0] }}</div>
        </div>
        <label class="btn btn--default account__image-chose" for="image" @click="chooseImage">
          Выбрать фото
          <input id="choose-photo" type="file" accept="image/*">
        </label>
      </div>
      <form-account-update :schema="schema" @form-submit="submitCustom"></form-account-update>
    </div>
  </div>
</template>