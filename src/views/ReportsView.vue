<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { salesService } from '../services/db'

// Define interfaces
interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Sale {
  id: number;
  date: string; // ISO string format
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  notes: string;
}

// Sales data
const sales = ref<Sale[]>([])
const loading = ref(true)
const dateRange = ref<string[]>([
  new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().substring(0, 10),
  new Date().toISOString().substring(0, 10)
])

// Load sales
const loadSales = async () => {
  loading.value = true
  try {
    const allSales = await salesService.getAll()

    // Sort by date (newest first)
    allSales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    sales.value = allSales
  } catch (error) {
    console.error('Error loading sales:', error)
  } finally {
    loading.value = false
  }
}

// Filter sales by date range
const filteredSales = computed(() => {
  if (!dateRange.value || dateRange.value.length !== 2) return sales.value

  const startDate = new Date(dateRange.value[0])
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(dateRange.value[1])
  endDate.setHours(23, 59, 59, 999)

  return sales.value.filter(sale => {
    const saleDate = new Date(sale.date)
    return saleDate >= startDate && saleDate <= endDate
  })
})

// Calculate total sales
const totalSales = computed(() => {
  return filteredSales.value.reduce((sum, sale) => sum + sale.total, 0)
})

// Calculate total transactions
const totalTransactions = computed(() => {
  return filteredSales.value.length
})

// Calculate average sale value
const averageSale = computed(() => {
  if (filteredSales.value.length === 0) return 0
  return totalSales.value / filteredSales.value.length
})

// Format date
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(price)
}

// View sale details
const viewSaleDetails = (sale: Sale) => {
  console.log('View sale details:', sale)
  // Implement view details functionality
}

// Load sales on mount
onMounted(loadSales)
</script>

<template>
  <div class="reports">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-6">Sales Reports</h1>
        </v-col>
      </v-row>

      <!-- Date Range Picker -->
      <v-card class="mb-6">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="8">
              <v-date-picker
                v-model="dateRange"
                range
                show-adjacent-months
              ></v-date-picker>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card variant="outlined" class="mb-4">
                <v-card-text>
                  <div class="text-subtitle-1">Total Sales</div>
                  <div class="text-h4">{{ formatPrice(totalSales) }}</div>
                </v-card-text>
              </v-card>

              <v-card variant="outlined" class="mb-4">
                <v-card-text>
                  <div class="text-subtitle-1">Transactions</div>
                  <div class="text-h4">{{ totalTransactions }}</div>
                </v-card-text>
              </v-card>

              <v-card variant="outlined">
                <v-card-text>
                  <div class="text-subtitle-1">Average Sale</div>
                  <div class="text-h4">{{ formatPrice(averageSale) }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Sales Table -->
      <v-card>
        <v-card-title>
          <v-text-field
            label="Search Sales"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            class="mb-4"
          ></v-text-field>
        </v-card-title>

        <v-data-table
          :headers="[
            { title: 'Date', key: 'date' },
            { title: 'Items', key: 'items' },
            { title: 'Payment Method', key: 'paymentMethod' },
            { title: 'Total', key: 'total' },
            { title: 'Actions', key: 'actions', sortable: false }
          ]"
          :items="filteredSales"
          :loading="loading"
          loading-text="Loading sales data..."
          no-data-text="No sales found"
        >
          <template v-slot:item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>

          <template v-slot:item.items="{ item }">
            {{ item.items.length }} items
          </template>

          <template v-slot:item.paymentMethod="{ item }">
            <v-chip
              :color="item.paymentMethod === 'cash' ? 'success' : item.paymentMethod === 'card' ? 'info' : 'warning'"
              size="small"
            >
              {{ item.paymentMethod }}
            </v-chip>
          </template>

          <template v-slot:item.total="{ item }">
            {{ formatPrice(item.total) }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon="mdi-eye"
              variant="text"
              density="compact"
              color="primary"
              @click="viewSaleDetails(item)"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
.reports {
  padding-bottom: 64px; /* Add padding for bottom navigation */
}
</style>
