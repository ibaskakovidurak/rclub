<script setup>
  const props = defineProps({
    messages: Array
  })

  const removeNotification = (id) => {
    const idx = props.messages.findIndex(m => m.id === id)
    props.messages.splice(idx, 1)
  }
</script>

<template v-if="messages">
  <div class="app-notice">
    <div class="notice" v-for="notice in messages" :class="`notice--${notice.type}`" :key="notice.id">
      <div class="notice__desc" v-html="notice.message"></div>
      <button type="button" class="notice__close" @click="removeNotification(notice.id)">&times;</button>
    </div>
  </div>
</template>