<script setup>
  import { computed, ref, watch } from 'vue'
  import { useStore } from 'vuex'

  const store = useStore()
  const user = ref(null)
  const loading = ref(true)
  const isAuth = computed(() => store.getters['auth/isAuth'])

  store.dispatch('user/getUser').then(res => {
    if (res) {
      loading.value = true
    } else {
      loading.value = false
    }
    user.value = res
  })

  watch(isAuth, value => {
    if ( value ) {
      store.dispatch('user/getUser').then(res => {
        loading.value = false
        user.value = res
      })
    } else {
      user.value = null
      loading.value = true
    }
  })
</script>

<template>
  <div class="sidebar__account">
    <router-link to="/account/" class="sidebar__account-link" v-if="!user">
      <svg v-if="!loading" width="25px" height="25px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M192,176V136a40,40,0,0,1,40-40H392a40,40,0,0,1,40,40V376a40,40,0,0,1-40,40H240c-22.09,0-48-17.91-48-40V336" style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path><polyline points="288 336 368 256 288 176" style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></polyline><line x1="80" y1="256" x2="352" y2="256" style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></line></svg>
      <span v-if="!loading">Войти</span>
      <span class="spinner" v-if="loading">Загрузка... <span class="spinner__circle"></span></span>
    </router-link>
    <router-link to="/account/" class="sidebar__account-link" v-else>
      <div class="sidebar__account-img-container">
        <img class="sidebar__account-img" :src="user.image" v-if="user.image.length > 0">
        <div class="sidebar__account-no-image" v-else>{{ user.name[0] }}</div>
      </div>
      <div class="sidebar__account-name">{{ user.name }}</div>
    </router-link>
  </div>
</template>