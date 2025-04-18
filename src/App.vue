<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from './stores/auth'

// Router
const router = useRouter()
const route = useRoute()

// Auth store
const { user, isAuthenticated, logout } = useAuth()

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

// Check if navigation should be hidden
const hideNavigation = computed(() => {
  return route.meta.hideNavigation === true
})

// Handle tab change
const handleTabChange = (tab) => {
  router.push(navigationItems[tab].route)
}

// Handle logout
const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}

// User menu
const userMenu = ref(false)
</script>

<template>
  <v-app>
    <!-- App Bar (only show when authenticated) -->
    <v-app-bar v-if="!hideNavigation" color="primary" elevation="0" density="compact">
      <v-toolbar-title class="font-weight-bold">KasirKilat</v-toolbar-title>
      <template v-slot:append>
        <v-btn icon="mdi-magnify" variant="text" density="comfortable"></v-btn>

        <!-- User menu -->
        <v-menu v-model="userMenu" :close-on-content-click="false" location="bottom end">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              :icon="user?.photoURL ? false : 'mdi-account-circle'"
              variant="text"
              density="comfortable"
            >
              <v-avatar v-if="user?.photoURL" size="32">
                <v-img :src="user.photoURL" alt="User Avatar"></v-img>
              </v-avatar>
            </v-btn>
          </template>

          <v-card min-width="200">
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar size="32">
                    <v-img
                      v-if="user?.photoURL"
                      :src="user.photoURL"
                      alt="User Avatar"
                    ></v-img>
                    <v-icon v-else>mdi-account-circle</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ user?.displayName || user?.email }}</v-list-item-title>
                <v-list-item-subtitle v-if="user?.isPro" class="text-success">
                  Pro Account
                </v-list-item-subtitle>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item @click="router.push('/settings')">
                <template v-slot:prepend>
                  <v-icon>mdi-cog</v-icon>
                </template>
                <v-list-item-title>Settings</v-list-item-title>
              </v-list-item>

              <v-list-item @click="handleLogout">
                <template v-slot:prepend>
                  <v-icon>mdi-logout</v-icon>
                </template>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </template>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- Bottom Navigation (only show when authenticated) -->
    <v-bottom-navigation
      v-if="!hideNavigation"
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
.page-container {
  padding: 16px;
  padding-bottom: 80px; /* Add padding for bottom navigation */
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
}

.rounded-card {
  border-radius: 16px !important;
}
</style>
