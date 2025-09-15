<template>
  <v-container>
    <h2>
      <v-icon icon="mdi-rocket" />
      SpaceX Rockets
    </h2>
    <v-row>
      <v-col
        v-for="rocket in rockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          class="mb-4 rocket-card"
          hover
          elevation="3"
          style="cursor: pointer;"
          @click="selectRocket(rocket)"
        >
          <v-card-title>{{ rocket.name }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog for rocket details -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>
          {{ selectedRocket?.name }}
        </v-card-title>
        <v-card-text>
          <div>
            <strong>Description:</strong>
            {{ selectedRocket?.description || 'N/A' }}
          </div>
          <div>
            <strong>First Flight:</strong>
            {{ selectedRocket?.first_flight || 'N/A' }}
          </div>
          <div>
            <strong>Height:</strong>
            {{ selectedRocket?.height?.meters || 'N/A' }} m
          </div>
          <div>
            <strong>Diameter:</strong>
            {{ selectedRocket?.diameter?.meters || 'N/A' }} m
          </div>
          <div>
            <strong>Mass:</strong>
            {{ selectedRocket?.mass?.kg || 'N/A' }} kg
          </div>
          <div>
            <strong>Stages:</strong>
            {{ selectedRocket?.stages || 'N/A' }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-alert v-if="!pending && rockets.length === 0" type="info" class="mt-4">
      No rockets found.
    </v-alert>
    <v-progress-linear v-if="pending" indeterminate color="blue" class="mt-4" />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const query = gql`
  query getRockets {
    rockets {
      id
      name
      description
      first_flight
      height {
        meters
      }
      diameter {
        meters
      }
      mass {
        kg
      }
      stages
    }
  }
`

const { data, pending } = useAsyncQuery<{ rockets: {
  id: string
  name: string
  description: string
  first_flight: string
  height?: { meters: number }
  diameter?: { meters: number }
  mass?: { kg: number }
  stages: number
}[] }>(query)

const rockets = computed(() => data.value?.rockets ?? [])

// Dialog state and selected rocket
const dialog = ref(false)
const selectedRocket = ref<
  | {
      id: string
      name: string
      description: string
      first_flight: string
      height?: { meters: number }
      diameter?: { meters: number }
      mass?: { kg: number }
      stages: number
    }
  | null
>(null)

function selectRocket(rocket: typeof selectedRocket.value) {
  selectedRocket.value = rocket
  dialog.value = true
}
</script>

<style scoped>
h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.rocket-card {
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  transition: transform 0.2s;
    &:hover {
      transform: translateY(-5px);  
      background-color: black;
      color: white;
      transition: background-color 0.5s, color 0.5s, transform 0.5s;
    }    
}
.rocket-card:hover {
  transform: translateY(-5px);
}
</style>