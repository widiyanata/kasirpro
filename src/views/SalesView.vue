<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { productService, salesService } from '../services/db'

// Define interfaces
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

// Products data
const products = ref<Product[]>([])
const loading = ref(true)

// Cart
const cart = ref<CartItem[]>([])
const paymentMethod = ref('cash')
const notes = ref('')

// Load products
const loadProducts = async () => {
  loading.value = true
  try {
    products.value = await productService.getAll()
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
}

// Add to cart
const addToCart = (product: Product) => {
  const existingItem = cart.value.find(item => item.productId === product.id)

  if (existingItem) {
    // Increment quantity if already in cart
    existingItem.quantity++
  } else {
    // Add new item to cart
    cart.value.push({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1
    })
  }
}

// Remove from cart
const removeFromCart = (index: number) => {
  cart.value.splice(index, 1)
}

// Update quantity
const updateQuantity = (index: number, quantity: number) => {
  if (quantity <= 0) {
    cart.value.splice(index, 1)
  } else {
    cart.value[index].quantity = quantity
  }
}

// Calculate total
const total = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(price)
}

// Complete sale
const completeSale = async () => {
  if (cart.value.length === 0) {
    alert('Cart is empty')
    return
  }

  try {
    // Create a serializable version of the cart items
    const serializableItems = cart.value.map(item => ({
      productId: item.productId,
      productName: item.productName,
      price: Number(item.price),
      quantity: Number(item.quantity)
    }))

    // Create a serializable sale object
    await salesService.add({
      date: new Date().toISOString(), // Convert Date to string
      items: serializableItems,
      total: Number(total.value),
      paymentMethod: paymentMethod.value,
      notes: notes.value
    })

    // Update product stock
    for (const item of cart.value) {
      const product = products.value.find(p => p.id === item.productId)
      if (product) {
        await productService.update(product.id, {
          stock: product.stock - item.quantity
        })
      }
    }

    // Reset cart
    cart.value = []
    paymentMethod.value = 'cash'
    notes.value = ''

    // Show success message
    alert('Sale completed successfully!')

    // Reload products to update stock
    loadProducts()
  } catch (error) {
    console.error('Error completing sale:', error)
    alert('Error completing sale')
  }
}

// Load products on mount
onMounted(loadProducts)
</script>

<template>
  <div class="sales page-container">
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="section-title mb-0">New Sale</h1>
      <v-btn
        color="success"
        variant="flat"
        density="comfortable"
        prepend-icon="mdi-cash-register"
        :disabled="cart.length === 0"
        @click="completeSale"
      >
        Complete
      </v-btn>
    </div>

    <v-row>
      <!-- Products List -->
      <v-col cols="12" md="7">
        <v-card class="rounded-card mb-4 mb-md-0">
          <v-card-text class="pa-2">
            <v-text-field
              label="Search Products"
              prepend-inner-icon="mdi-magnify"
              variant="solo"
              density="compact"
              hide-details
              class="rounded-pill mb-2"
              bg-color="surface-variant"
            ></v-text-field>
          </v-card-text>

          <v-divider></v-divider>

          <v-container fluid class="pa-2">
            <v-row dense>
              <v-col
                v-for="product in products"
                :key="product.id"
                cols="6"
                sm="4"
                md="4"
              >
                <v-card
                  variant="outlined"
                  :disabled="product.stock <= 0"
                  @click="addToCart(product)"
                  class="product-card rounded-lg"
                  :class="{'border-primary': product.stock > 0}"
                >
                  <v-card-text class="text-center py-3">
                    <v-avatar
                      :color="product.stock > 0 ? 'primary' : 'grey-lighten-1'"
                      class="mb-2"
                      size="36"
                    >
                      <v-icon color="white" size="small">mdi-package-variant-closed</v-icon>
                    </v-avatar>
                    <div class="text-body-2 font-weight-medium text-truncate mb-1">{{ product.name }}</div>
                    <div class="d-flex justify-space-between align-center">
                      <span class="text-caption font-weight-bold">{{ formatPrice(product.price) }}</span>
                      <v-chip
                        :color="product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'"
                        size="x-small"
                        class="font-weight-medium"
                      >
                        {{ product.stock }}
                      </v-chip>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>

      <!-- Cart -->
      <v-col cols="12" md="5">
        <v-card class="rounded-card">
          <v-toolbar color="primary" density="compact" class="rounded-t-lg">
            <v-toolbar-title class="text-subtitle-1">Shopping Cart</v-toolbar-title>
            <template v-slot:append>
              <v-badge
                :content="cart.length"
                :value="cart.length"
                color="error"
                offset-x="5"
                offset-y="5"
              >
                <v-icon>mdi-cart</v-icon>
              </v-badge>
            </template>
          </v-toolbar>

          <div v-if="cart.length === 0" class="text-center pa-6">
            <v-icon size="large" color="grey-lighten-1">mdi-cart-outline</v-icon>
            <div class="text-subtitle-1 mt-2">Cart is empty</div>
            <div class="text-caption">Click on products to add them to cart</div>
          </div>

          <v-list v-else class="compact-list pa-0">
            <v-list-item
              v-for="(item, index) in cart"
              :key="index"
              density="compact"
              class="py-1"
            >
              <template v-slot:prepend>
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  density="compact"
                  size="small"
                  color="error"
                  @click="removeFromCart(index)"
                ></v-btn>
              </template>

              <v-list-item-title class="text-body-2">{{ item.productName }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ formatPrice(item.price) }} × {{ item.quantity }}</v-list-item-subtitle>

              <template v-slot:append>
                <div class="d-flex align-center">
                  <v-btn
                    icon="mdi-minus"
                    variant="text"
                    density="compact"
                    size="x-small"
                    @click="updateQuantity(index, item.quantity - 1)"
                  ></v-btn>
                  <span class="mx-1 text-body-2">{{ item.quantity }}</span>
                  <v-btn
                    icon="mdi-plus"
                    variant="text"
                    density="compact"
                    size="x-small"
                    @click="updateQuantity(index, item.quantity + 1)"
                  ></v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>

          <v-divider v-if="cart.length > 0"></v-divider>

          <v-card-text v-if="cart.length > 0" class="pt-3">
            <div class="d-flex justify-space-between align-center mb-3">
              <div class="text-subtitle-1 font-weight-bold">Total:</div>
              <div class="text-subtitle-1 font-weight-bold primary--text">{{ formatPrice(total) }}</div>
            </div>

            <v-select
              v-model="paymentMethod"
              label="Payment Method"
              :items="[
                {title: 'Cash', value: 'cash'},
                {title: 'Card', value: 'card'},
                {title: 'Transfer', value: 'transfer'}
              ]"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="compact"
              class="mb-3"
              hide-details
            ></v-select>

            <v-textarea
              v-model="notes"
              label="Notes"
              variant="outlined"
              density="compact"
              rows="2"
              class="mb-3"
              hide-details
            ></v-textarea>

            <v-btn
              block
              color="success"
              variant="flat"
              prepend-icon="mdi-cash-register"
              @click="completeSale"
            >
              Complete Sale
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.sales {
  padding-bottom: 64px; /* Add padding for bottom navigation */
}

.product-card {
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.border-primary {
  border-color: var(--v-theme-primary);
}
</style>
