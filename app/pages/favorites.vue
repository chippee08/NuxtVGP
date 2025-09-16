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
        <v-card 
          class="mb-4 mt-4 clickable-card" 
          height="300"
          hover
          @click="openRocketDialog(rocket)"
          style="cursor: pointer;"
        >
          <v-card-title>{{ rocket.name }}</v-card-title>
          <v-card-text>
            <div><strong>Description:</strong> {{ rocket.description }}</div>
            <div><strong>First Flight:</strong> {{ rocket.first_flight }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn 
              color="red" 
              text 
              @click.stop="favorites.removeFavorite(rocket.id)"
            >
              Remove
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Rocket Timeline Dialog -->
    <v-dialog v-model="rocketDialog" max-width="1200">
      <v-card v-if="selectedRocket">
        <v-card-title class="d-flex align-center">
          <v-icon icon="mdi-rocket" class="mr-2" />
          {{ selectedRocket.name }}
          <v-spacer />
          <v-btn icon @click="rocketDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <div class="mb-4">
            <div class="mb-2"><strong>Description:</strong> {{ selectedRocket.description }}</div>
            <div><strong>First Flight:</strong> {{ selectedRocket.first_flight }}</div>
          </div>
          
          <!-- Timeline Toggle Button -->
          <div class="text-center mb-4">
            <v-btn 
              :color="showTimeline ? 'orange' : 'primary'"
              @click="toggleTimeline"
              size="large"
            >
              <v-icon :icon="showTimeline ? 'mdi-timeline-remove' : 'mdi-timeline'" class="mr-2" />
              {{ showTimeline ? 'Hide Timeline' : 'View Timeline' }}
            </v-btn>
          </div>

          <!-- Timeline Component -->
          <div v-if="showTimeline" class="timeline-container">
            <RocketTimeline :rocket="selectedRocket" />
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="red" variant="text" @click="removeFavoriteFromDialog">
            <v-icon icon="mdi-bookmark-remove" class="mr-1" />
            Remove from Favorites
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-alert v-if="favorites.favoriteRockets.length === 0" type="info" class="mt-8">
      No favorite rockets yet.
    </v-alert>
    <v-btn color="red" class="mt-4" @click="favorites.clearFavorites">
      Clear All Favorites
    </v-btn>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useFavoritesStore } from '~/stores/favorites'
import RocketTimeline from '~/components/RocketTimeline.vue'

const favorites = useFavoritesStore()

// Dialog state
const rocketDialog = ref(false)
const selectedRocket = ref(null)
const showTimeline = ref(false)

// Dialog functions
function openRocketDialog(rocket) {
  selectedRocket.value = rocket
  showTimeline.value = false // Reset timeline visibility
  rocketDialog.value = true
}

function toggleTimeline() {
  showTimeline.value = !showTimeline.value
}

function removeFavoriteFromDialog() {
  if (selectedRocket.value) {
    favorites.removeFavorite(selectedRocket.value.id)
    rocketDialog.value = false
    selectedRocket.value = null
    showTimeline.value = false
  }
}
</script>

<style scoped>
.clickable-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clickable-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.timeline-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
}
</style>