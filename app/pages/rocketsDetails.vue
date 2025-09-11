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
          @click="goToRocket(rocket.id)"
        >
          <v-card-title>{{ rocket.name }}</v-card-title>
          <v-card-subtitle>
            First Flight: {{ rocket.first_flight || 'N/A' }}
          </v-card-subtitle>
          <v-card-text>
            <div>
              <strong>Description:</strong>
              {{ rocket.description || 'N/A' }}
            </div>
            <div>
              <strong>Height:</strong>
              {{ rocket.height?.meters || 'N/A' }} m
            </div>
            <div>
              <strong>Diameter:</strong>
              {{ rocket.diameter?.meters || 'N/A' }} m
            </div>
            <div>
              <strong>Mass:</strong>
              {{ rocket.mass?.kg || 'N/A' }} kg
            </div>
            <div>
              <strong>Stages:</strong>
              {{ rocket.stages || 'N/A' }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-alert v-if="!pending && rockets.length === 0" type="info" class="mt-4">
      No rockets found.
    </v-alert>
    <v-progress-linear v-if="pending" indeterminate color="blue" class="mt-4" />
  </v-container>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

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

function goToRocket(id: string) {
  router.push(`/rockets/${id}`)
}
</script>

<style scoped>
 h2{
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
.rocket-card {
  min-height: 350px;
  display: flex;
  flex-direction: column;
}
</style>