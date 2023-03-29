<script setup>
  import TheSidebar from '../components/sidebar/TheSidebar.vue'
</script>

<template>
  <the-sidebar></the-sidebar>
  <main class="main">
    <div class="content">
      <router-view></router-view>
    </div>
  </main>
</template>

