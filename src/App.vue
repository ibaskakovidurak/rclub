<template>
  <component :is="layout"></component>
  <teleport to="body" v-if="notification">
    <toster-notification :messages="messages"></toster-notification>
  </teleport>
</template>

<script>
import {watch, ref, computed} from 'vue'
  import { useStore } from 'vuex'
  import { useRoute } from 'vue-router'
  import Main from './layouts/Main.vue'
  import Auth from './layouts/Auth.vue'
  import TosterNotification from './components/TosterNotification.vue'

  export default {
    setup () {
      const store = useStore()
      const route = useRoute()
      const notification = ref(false)
      const messages = store.getters.messages

      watch(messages, val => {
        notification.value = true
      })

      return{
        notification,
        messages,
        layout: computed(() => route.meta.layout)
      }
    },
    components: {Main, Auth, TosterNotification}
  }
</script>
