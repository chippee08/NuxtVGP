<template>
  <v-app-bar color="black" dark>
    <v-app-bar-nav-icon
      class="d-sm-none"
      @click="drawer = !drawer"
    />
    <v-toolbar-title>
      <v-icon icon="mdi-rocket" class="mr-2" />
      SpaceX
    </v-toolbar-title>
    <v-spacer />
    <!-- Navigation buttons for desktop -->
    <div class="d-none d-sm-flex">
      <v-btn to="/" text>Home</v-btn>
      <v-btn to="/spaceXLaunches" text>Launches</v-btn>
      <v-btn to="/rocketsDetails" text>Rockets</v-btn>
      <v-btn to="/favorites" text>
        <v-icon icon="mdi-bookmark" class="mr-1" />
        Favorites
      </v-btn>
    </div>
  </v-app-bar>

  <!-- Navigation drawer for mobile -->
  <v-navigation-drawer
    v-model="drawer"
    temporary
    left
    class="d-sm-none"
  >
    <v-list>
      <v-list-item to="/">
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>
      <v-list-item to="/spaceXLaunches">
        <v-list-item-title>Launches</v-list-item-title>
      </v-list-item>
      <v-list-item to="/rocketsDetails">
        <v-list-item-title>Rockets</v-list-item-title>
      </v-list-item>
      <v-list-item to="/favorites">
        <v-list-item-title>
          <v-icon icon="mdi-bookmark" class="mr-1" />
          Favorites
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
const drawer = ref(false)
</script>