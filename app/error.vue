<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

// Redirect to launches page after a short delay
setTimeout(() => {
  router.replace('/spaceXLaunches')
}, 1500)
</script>

<template>
  <v-container class="text-center">
    <h1>Page Not Found</h1>
    <p>Redirecting to launches...</p>
  </v-container>
</template>