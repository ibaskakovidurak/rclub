<script setup>
  import Sidebar from '../components/sidebar/Index.vue'
</script>

<template>
  <sidebar></sidebar>
  <main class="main">
    <div class="content">
      <router-view></router-view>
    </div>
  </main>
</template>

