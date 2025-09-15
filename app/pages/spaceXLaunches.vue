<template>
  <v-container>
    <h2>
      <v-icon icon="mdi-rocket" />
      SpaceX Launches
    </h2>

    <!-- Filter and Sort Controls -->
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="selectedYear"
          :items="years"
          label="Filter by Year"
          item-title="label"
          item-value="value"
        />
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="sortOrder"
          :items="sortOptions"
          label="Sort by Launch Date"
          item-title="label"
          item-value="value"
        />
      </v-col>
    </v-row>

    <!-- Card grid for launches -->
    <v-row>
      <v-col
        v-for="launch in sortedLaunches"
        :key="launch.id"
        cols="12"
        sm="6"
        md="4"
      >
        <!-- Card for each launch -->
        <v-card
          class="mb-4 launch-card"
          @click="selectLaunch(launch)"
          hover
          elevation="3"
          style="cursor: pointer;"
        >
          <v-card-title>{{ launch.mission_name }}</v-card-title>
          <v-card-subtitle>
            {{ formatDate(launch.launch_date_utc) }}
          </v-card-subtitle>
          <v-card-text>
            <div>
              <strong>Launch Site:</strong>
              {{ launch.launch_site?.site_name_long || 'N/A' }}
            </div>
            <div>
              <strong>Rocket:</strong>
              {{ launch.rocket?.rocket_name || 'N/A' }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog for launch details -->
     <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        {{ selectedLaunch?.mission_name }}
        <v-spacer />
        <v-btn
          color="black"
          text
          :disabled="!selectedLaunch"
          @click="handleFavorite(selectedLaunch)"
        >
          <v-icon :icon="selectedLaunch && selectedLaunch.rocket?.rocket && favorites.isFavorite(selectedLaunch.rocket.rocket.id) ? 'mdi-bookmark-remove' : 'mdi-bookmark-plus'" class="mr-1" />
          {{ selectedLaunch && selectedLaunch.rocket?.rocket && favorites.isFavorite(selectedLaunch.rocket.rocket.id) ? 'Remove from Favorites' : 'Add to Favorites' }}
        </v-btn>
      </v-card-title>
      <v-card-text>
          <div>
            <strong>Mission Name:</strong>
            {{ selectedLaunch?.mission_name }}
          </div>
          <div>
            <strong>Launch Date:</strong>
            {{ formatDate(selectedLaunch?.launch_date_utc) }}
          </div>
          <div>
            <strong>Launch Site:</strong>
            {{ selectedLaunch?.launch_site?.site_name_long || 'N/A' }}
          </div>
          <div>
            <strong>Rocket Name:</strong>
            {{ selectedLaunch?.rocket?.rocket_name || 'N/A' }}
          </div>
          <div>
            <strong>Details:</strong>
            {{ selectedLaunch?.details || 'N/A' }}
          </div>
       </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue" text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Snackbar for confirmation -->
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2000">
    {{ snackbar.message }}
  </v-snackbar>
    <!-- Alert if no launches found -->
    <v-alert v-if="!pending && sortedLaunches.length === 0" type="info" class="mt-4">
      No launches found.
    </v-alert>
    <!-- Loading indicator -->
    <v-progress-linear v-if="pending" indeterminate color="blue" class="mt-4" />
  </v-container>
</template>


<!-- ts code -->
<script lang="ts" setup>

import { ref, computed } from 'vue'
import { useFavoritesStore } from '~/stores/favorites'
const favorites = useFavoritesStore()

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

function handleFavorite(launch: any) {
  if (!launch || !launch.rocket?.rocket) {
    snackbar.value = { show: true, message: 'Could not be added to favorites.', color: 'error' }
    return
  }
  const result = favorites.addOrRemoveFavorite(launch.rocket.rocket)  
  if (result === 'added') {
    snackbar.value = { show: true, message: 'Successfully added to favorites!', color: 'success' }
  } else if (result === 'removed') {
    snackbar.value = { show: true, message: 'Removed from favorites.', color: 'info' }
  } else {
    snackbar.value = { show: true, message: 'Could not be added to favorites.', color: 'error' }
  }
}

// GraphQL query to fetch launches - USING YOUR ORIGINAL WORKING QUERY
const query = gql`
query getLaunches {
  launches {
    id
    mission_name
    launch_date_utc
    launch_site {
      site_name_long
    }
    rocket {
      rocket_name
      rocket {
        id
        name
        description
        first_flight
      }
    }
    details
  }
}

`

// Fetch data using useAsyncQuery composable
const { data, pending } = useAsyncQuery<{
  launches: {
    id: string
    mission_name: string
    launch_date_utc: string
    launch_site?: { site_name_long: string }
    rocket?: { rocket_name: string }
    details?: string
  }[]
}>(query)

// Computed property for launches
const launches = computed(() => data.value?.launches ?? [])

// Extract unique years from launches
const years = computed(() => {
  const yearSet = new Set<string>()
  launches.value.forEach(l => {
    if (l.launch_date_utc) {
      yearSet.add(new Date(l.launch_date_utc).getFullYear().toString())
    }
  })
  // Sort years descending and add "All" option
  return [
    { label: 'All Years', value: '' },
    ...Array.from(yearSet).sort((a, b) => parseInt(b) - parseInt(a)).map(y => ({ label: y, value: y }))
  ]
})

// Selected year for filtering
const selectedYear = ref('')

// Filter launches by selected year
const filteredLaunches = computed(() => {
  if (!selectedYear.value) return launches.value
  return launches.value.filter(l => {
    if (!l.launch_date_utc) return false
    return new Date(l.launch_date_utc).getFullYear().toString() === selectedYear.value
  })
})

// Sorting options
const sortOptions = [
  { label: 'Newest First', value: 'desc' },
  { label: 'Oldest First', value: 'asc' }
]
const sortOrder = ref('desc')

// Sort launches by launch date
const sortedLaunches = computed(() => {
  return [...filteredLaunches.value].sort((a, b) => {
    const dateA = a.launch_date_utc ? new Date(a.launch_date_utc).getTime() : 0
    const dateB = b.launch_date_utc ? new Date(b.launch_date_utc).getTime() : 0
    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA
  })
})

// Dialog state and selected launch
const dialog = ref(false)
const selectedLaunch = ref<
  | {
      id: string
      mission_name: string
      launch_date_utc: string
      launch_site?: { site_name_long: string }
      rocket?: { 
        rocket_name: string
        rocket: {
          id: string
          name: string
          description: string
          first_flight: string
        }
      }
      details?: string
    }
  | null
>(null)

// Function to select a launch and open dialog
function selectLaunch(launch: Launch) {
  selectedLaunch.value = launch
  dialog.value = true
}

// Helper function to format launch date
function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleString()
}
</script>

<style scoped>
  h2{
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  } 
  .launch-card {
    transition: transform 0.2s;
    &:hover {
      transform: translateY(-5px);  
      background-color: black;
      color: white;
      transition: background-color 0.5s, color 0.5s, transform 0.5s;
    }    
  }
</style>