<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productService, salesService } from '../services/db'

// Stats
const totalProducts = ref(0)
const todaySales = ref(0)
const totalSales = ref(0)

// Load data
onMounted(async () => {
  try {
    // Get products count
    const products = await productService.getAll()
    totalProducts.value = products.length

    // Get sales data
    const sales = await salesService.getAll()
    totalSales.value = sales.length

    // Calculate today's sales
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todaySalesData = sales.filter(sale => {
      const saleDate = new Date(sale.date)
      saleDate.setHours(0, 0, 0, 0)
      return saleDate.getTime() === today.getTime()
    })

    todaySales.value = todaySalesData.length
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
})
</script>

<template>
  <div class="home page-container">
    <h1 class="section-title mb-4">Dashboard</h1>

    <!-- Stats Cards -->
    <v-row dense>
      <v-col cols="4">
        <v-card class="rounded-card mb-3" color="primary" theme="dark">
          <v-card-text class="text-center py-4">
            <div class="text-h4 font-weight-bold mb-1">{{ totalProducts }}</div>
            <div class="text-caption">Products</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card class="rounded-card mb-3" color="success" theme="dark">
          <v-card-text class="text-center py-4">
            <div class="text-h4 font-weight-bold mb-1">{{ todaySales }}</div>
            <div class="text-caption">Today's Sales</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card class="rounded-card mb-3" color="info" theme="dark">
          <v-card-text class="text-center py-4">
            <div class="text-h4 font-weight-bold mb-1">{{ totalSales }}</div>
            <div class="text-caption">Total Sales</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <h2 class="section-title mt-6 mb-3">Quick Actions</h2>
    <v-row dense>
      <v-col cols="6" sm="3">
        <v-card class="rounded-card mb-3" to="/sales" variant="outlined">
          <v-card-text class="text-center py-4">
            <v-icon size="large" color="primary" class="mb-2">mdi-cash-register</v-icon>
            <div class="text-body-2">New Sale</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" sm="3">
        <v-card class="rounded-card mb-3" to="/products" variant="outlined">
          <v-card-text class="text-center py-4">
            <v-icon size="large" color="secondary" class="mb-2">mdi-package-variant-closed</v-icon>
            <div class="text-body-2">Products</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" sm="3">
        <v-card class="rounded-card mb-3" to="/reports" variant="outlined">
          <v-card-text class="text-center py-4">
            <v-icon size="large" color="info" class="mb-2">mdi-chart-bar</v-icon>
            <div class="text-body-2">Reports</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6" sm="3">
        <v-card class="rounded-card mb-3" to="/settings" variant="outlined">
          <v-card-text class="text-center py-4">
            <v-icon size="large" color="warning" class="mb-2">mdi-cog</v-icon>
            <div class="text-body-2">Settings</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Sales -->
    <h2 class="section-title mt-6 mb-3">Recent Activity</h2>
    <v-card class="rounded-card">
      <v-list class="compact-list">
        <v-list-item v-if="totalSales === 0">
          <v-list-item-title class="text-center text-body-2 py-4">
            No recent activity
          </v-list-item-title>
        </v-list-item>
        <template v-else>
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar color="primary" size="small">
                <v-icon color="white" size="small">mdi-cash-register</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title>New sale completed</v-list-item-title>
            <v-list-item-subtitle>Just now</v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar color="secondary" size="small">
                <v-icon color="white" size="small">mdi-package-variant-closed</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title>Product added</v-list-item-title>
            <v-list-item-subtitle>2 hours ago</v-list-item-subtitle>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </div>
</template>

<style scoped>
.home {
  padding-bottom: 64px; /* Add padding for bottom navigation */
}
</style>
