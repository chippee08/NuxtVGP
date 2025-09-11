import { defineNuxtRouteMiddleware, useRoute, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to) => {
  // If the route is not matched (Nuxt sets matched.length to 0 for unknown routes)
  if (to.matched.length === 0) {
    // Redirect to the launches page
    return navigateTo('/spaceXLaunches')
  }
})