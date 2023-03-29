<script setup>
  const props = defineProps({
    nav: Array
  })

  const nav = props.nav.filter(r => r.meta.excluded !== true)
</script>

<template>
  <nav>
    <ul class="header__menu">
      <li v-for="link in nav" :key="link" v-if="nav">
        <router-link :to="link.path">{{ link.meta.heading }}</router-link>
      </li>
    </ul>
  </nav>
</template>