<script setup>
  import { useRouter } from 'vue-router'
  import SidebarNav from './SidebarNav.vue'

  const router = useRouter()
  const routes = router.getRoutes()
</script>

<template>
  <header class="header">
    <div class="row header__row">
      <div class="header__left">
        <router-link to="/" class="header__logo">Растикопер Club</router-link>
      </div>
      <div class="header__right">
        <sidebar-nav :nav="routes"></sidebar-nav>
      </div>
    </div>
  </header>
</template>