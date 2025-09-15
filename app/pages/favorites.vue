<template>
  <v-container>
    <h2>
      <v-icon icon="mdi-bookmark" class="mr-2" />
      Favorite Rockets
    </h2>
    <v-row>
      <v-col
        v-for="rocket in favorites.favoriteRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="mb-4 mt-4" height="300">
          <v-card-title>{{ rocket.name }}</v-card-title>
          <v-card-text>
            <div><strong>Description:</strong> {{ rocket.description }}</div>
            <div><strong>First Flight:</strong> {{ rocket.first_flight }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="red" text @click="favorites.removeFavorite(rocket.id)">
              Remove
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-alert v-if="favorites.favoriteRockets.length === 0" type="info" class="mt-8">
      No favorite rockets yet.
    </v-alert>
    <v-btn color="red" class="mt-4" @click="favorites.clearFavorites">
      Clear All Favorites
    </v-btn>
  </v-container>
</template>

<script setup>
import { useFavoritesStore } from '~/stores/favorites'
const favorites = useFavoritesStore()
</script>