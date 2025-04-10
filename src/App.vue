<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Router
const router = useRouter()
const route = useRoute()

// Navigation items
const navigationItems = [
  { title: 'Home', icon: 'mdi-home', route: '/' },
  { title: 'Products', icon: 'mdi-package-variant-closed', route: '/products' },
  { title: 'Sales', icon: 'mdi-cash-register', route: '/sales' },
  { title: 'Reports', icon: 'mdi-chart-bar', route: '/reports' },
  { title: 'Settings', icon: 'mdi-cog', route: '/settings' }
]

// Compute active tab based on current route
const activeTab = computed(() => {
  const currentPath = route.path
  const index = navigationItems.findIndex(item => item.route === currentPath)
  return index >= 0 ? index : 0
})

// Handle tab change
const handleTabChange = (tab) => {
  router.push(navigationItems[tab].route)
}
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" elevation="0" density="compact">
      <v-toolbar-title class="font-weight-bold">KasirKilat</v-toolbar-title>
      <template v-slot:append>
        <v-btn icon="mdi-magnify" variant="text" density="comfortable"></v-btn>
        <v-btn icon="mdi-bell-outline" variant="text" density="comfortable"></v-btn>
      </template>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- Bottom Navigation -->
    <v-bottom-navigation
      :model-value="activeTab"
      @update:model-value="handleTabChange"
      color="primary"
      bg-color="surface"
      elevation="2"
      mode="shift"
      class="rounded-t-xl"
    >
      <v-btn
        v-for="(item, i) in navigationItems"
        :key="i"
        :value="i"
        :ripple="false"
        class="text-body-2"
      >
        <v-icon size="small" class="mb-1">{{ item.icon }}</v-icon>
        <span class="text-caption">{{ item.title }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<style>
/* Global styles */
</style>
