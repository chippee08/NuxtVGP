<template>
  <div class="rocket-timeline">
    <h2 class="text-2xl font-bold mb-4">🚀 {{ rocket.name }} Timeline</h2>
    
    <!-- Loading State -->
    <div v-if="launchesLoading" class="text-center pa-4">
      <v-progress-circular indeterminate color="primary" />
      <div class="mt-2">Loading timeline...</div>
    </div>

    <!-- Timeline Content -->
    <div v-else>
      <!-- Stats -->
      <div class="mb-4">
        <v-row>
          <v-col cols="4">
            <v-card variant="outlined" class="text-center pa-2">
              <div class="text-h6">{{ launches.length }}</div>
              <div class="text-caption">Total Launches</div>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card variant="outlined" class="text-center pa-2">
              <div class="text-h6">{{ successfulLaunches }}</div>
              <div class="text-caption">Successful</div>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card variant="outlined" class="text-center pa-2">
              <div class="text-h6">{{ successRate }}%</div>
              <div class="text-caption">Success Rate</div>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Timeline -->
      <v-timeline side="end" density="compact">
        <!-- First Flight Milestone -->
        <v-timeline-item
          dot-color="purple"
          size="large"
          class="mb-4"
        >
          <template #icon>
            <v-icon color="white">mdi-star</v-icon>
          </template>
          <template #opposite>
            <div class="text-caption text-grey">
              {{ formatDate(rocket.first_flight) }}
            </div>
          </template>
          <v-card color="purple" variant="outlined">
            <v-card-title class="text-black">
              🎉 First Flight
            </v-card-title>
            <v-card-text class="text-black">
              {{ rocket.name }} maiden voyage
            </v-card-text>
          </v-card>
        </v-timeline-item>

        <!-- Launch Timeline Items -->
        <v-timeline-item
          v-for="launch in launches"
          :key="launch.id"
          :dot-color="getLaunchColor(launch)"
          size="small"
          class="mb-2"
        >
          <template #icon>
            <v-icon color="white" size="small">
              {{ getLaunchIcon(launch) }}
            </v-icon>
          </template>
          <template #opposite>
            <div class="text-caption text-grey">
              {{ formatDate(launch.date) }}
            </div>
          </template>
          <v-card variant="outlined" class="timeline-card">
            <v-card-title class="text-subtitle-1">
              {{ launch.mission }}
              <v-chip 
                v-if="launch.upcoming" 
                color="orange" 
                size="small" 
                class="ml-2"
              >
                Upcoming
              </v-chip>
            </v-card-title>
            <v-card-text>
              <div class="text-caption mb-1">
                <strong>Launch Site:</strong> {{ launch.site }}
              </div>
              <div class="text-caption">
                <v-chip 
                  :color="getLaunchColor(launch)" 
                  size="x-small"
                  :text="launch.status"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props
const props = defineProps({
  rocket: {
    type: Object,
    required: true
  }
})

// State
const launchesLoading = ref(true)
const launches = ref([])

// Computed
const successfulLaunches = computed(() => 
  launches.value.filter(l => l.success && !l.upcoming).length
)

const successRate = computed(() => {
  const completedLaunches = launches.value.filter(l => !l.upcoming)
  if (completedLaunches.length === 0) return 0
  return Math.round((successfulLaunches.value / completedLaunches.length) * 100)
})

// Methods
function formatDate(dateStr) {
  if (!dateStr) return 'TBD'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function getLaunchColor(launch) {
  if (launch.upcoming) return 'orange'
  if (launch.success) return 'green'
  return 'red'
}

function getLaunchIcon(launch) {
  if (launch.upcoming) return 'mdi-clock'
  if (launch.success) return 'mdi-check'
  return 'mdi-close'
}

function generateSampleLaunches() {
  const startDate = new Date(props.rocket.first_flight)
  const now = new Date()
  const launches = []
  
  // Generate historical launches
  for (let i = 0; i < 12; i++) {
    const launchDate = new Date(startDate.getTime() + (i * 120 * 24 * 60 * 60 * 1000)) // Every ~4 months
    if (launchDate <= now) {
      launches.push({
        id: `launch-${i}`,
        mission: `${props.rocket.name} Mission ${i + 1}`,
        date: launchDate.toISOString(),
        success: Math.random() > 0.1, // 90% success rate
        upcoming: false,
        site: i % 2 === 0 ? 'Kennedy Space Center' : 'Vandenberg SFB',
        status: Math.random() > 0.1 ? 'Success' : 'Failed'
      })
    }
  }
  
  // Add upcoming launch
  const futureDate = new Date(now.getTime() + (45 * 24 * 60 * 60 * 1000))
  launches.push({
    id: 'upcoming-launch',
    mission: `${props.rocket.name} Future Mission`,
    date: futureDate.toISOString(),
    success: null,
    upcoming: true,
    site: 'Kennedy Space Center',
    status: 'Upcoming'
  })
  
  return launches
}

// Load timeline data
onMounted(async () => {
  launchesLoading.value = true
  
  // Simulate loading delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Generate sample data
  launches.value = generateSampleLaunches()
  
  launchesLoading.value = false
})
</script>

<style scoped>
.rocket-timeline {
  padding: 16px;
}

.timeline-card {
  transition: all 0.2s ease;
}

.timeline-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>