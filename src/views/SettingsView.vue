<script setup lang="ts">
import { ref } from 'vue'

// Settings
const businessName = ref('My Business')
const currency = ref('IDR')
const theme = ref('light')
const language = ref('en')

// Save settings
const saveSettings = () => {
  // In a real app, we would save these to localStorage or IndexedDB
  localStorage.setItem('settings', JSON.stringify({
    businessName: businessName.value,
    currency: currency.value,
    theme: theme.value,
    language: language.value
  }))
  
  alert('Settings saved successfully!')
}

// Load settings from localStorage
const loadSettings = () => {
  const savedSettings = localStorage.getItem('settings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    businessName.value = settings.businessName || 'My Business'
    currency.value = settings.currency || 'IDR'
    theme.value = settings.theme || 'light'
    language.value = settings.language || 'en'
  }
}

// Export data
const exportData = async () => {
  alert('Data export functionality will be implemented in a future update.')
}

// Import data
const importData = async () => {
  alert('Data import functionality will be implemented in a future update.')
}

// Clear all data
const clearData = async () => {
  const confirm = window.confirm('Are you sure you want to clear all data? This action cannot be undone.')
  if (confirm) {
    // In a real app, we would clear the IndexedDB
    alert('Data clearing functionality will be implemented in a future update.')
  }
}

// Load settings on mount
loadSettings()
</script>

<template>
  <div class="settings">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-6">Settings</h1>
        </v-col>
      </v-row>

      <v-card class="mb-6">
        <v-card-title>Business Settings</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="businessName"
            label="Business Name"
            variant="outlined"
            class="mb-4"
          ></v-text-field>

          <v-select
            v-model="currency"
            label="Currency"
            :items="['IDR', 'USD', 'EUR', 'SGD', 'MYR']"
            variant="outlined"
            class="mb-4"
          ></v-select>
        </v-card-text>
      </v-card>

      <v-card class="mb-6">
        <v-card-title>App Settings</v-card-title>
        <v-card-text>
          <v-select
            v-model="theme"
            label="Theme"
            :items="[
              { title: 'Light', value: 'light' },
              { title: 'Dark', value: 'dark' }
            ]"
            item-title="title"
            item-value="value"
            variant="outlined"
            class="mb-4"
          ></v-select>

          <v-select
            v-model="language"
            label="Language"
            :items="[
              { title: 'English', value: 'en' },
              { title: 'Indonesian', value: 'id' }
            ]"
            item-title="title"
            item-value="value"
            variant="outlined"
            class="mb-4"
          ></v-select>

          <v-btn
            color="primary"
            block
            @click="saveSettings"
          >
            Save Settings
          </v-btn>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-title>Data Management</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="4">
              <v-btn
                color="primary"
                variant="outlined"
                block
                prepend-icon="mdi-database-export"
                @click="exportData"
              >
                Export Data
              </v-btn>
            </v-col>
            <v-col cols="12" sm="4">
              <v-btn
                color="info"
                variant="outlined"
                block
                prepend-icon="mdi-database-import"
                @click="importData"
              >
                Import Data
              </v-btn>
            </v-col>
            <v-col cols="12" sm="4">
              <v-btn
                color="error"
                variant="outlined"
                block
                prepend-icon="mdi-delete"
                @click="clearData"
              >
                Clear All Data
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mt-6">
        <v-card-title>About</v-card-title>
        <v-card-text>
          <div class="text-center">
            <h2 class="text-h5 mb-2">KasirKilat</h2>
            <p class="mb-2">Version 1.0.0</p>
            <p>A simple and fast sales recording app for small businesses</p>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
.settings {
  padding-bottom: 64px; /* Add padding for bottom navigation */
}
</style>
