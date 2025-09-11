<template>
  <v-app>
    <NavBar />
    <v-main>
      <slot />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup>
import NavBar from '~/components/NavBar.vue'
import AppFooter from '~/components/Footer.vue'
</script>