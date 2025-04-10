<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productService } from '../services/db'

// Define product interface
interface Product {
  id: number | null;
  name: string;
  price: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Products data
const products = ref<Product[]>([])
const loading = ref(true)
const dialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref<Product>({
  id: null,
  name: '',
  price: 0,
  stock: 0
})
const defaultItem: Product = {
  id: null,
  name: '',
  price: 0,
  stock: 0
}

// Search
const search = ref('')

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

// Edit item
const editItem = (item: Product) => {
  editedIndex.value = products.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialog.value = true
}

// Delete item
const deleteItem = async (item: Product) => {
  const confirm = window.confirm('Are you sure you want to delete this product?')
  if (confirm) {
    try {
      await productService.delete(item.id)
      const index = products.value.indexOf(item)
      products.value.splice(index, 1)
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }
}

// Close dialog
const close = () => {
  dialog.value = false
  editedIndex.value = -1
  editedItem.value = Object.assign({}, defaultItem)
}

// Save
const save = async () => {
  try {
    if (editedIndex.value > -1) {
      // Update existing product
      await productService.update(editedItem.value.id, {
        name: editedItem.value.name,
        price: editedItem.value.price,
        stock: editedItem.value.stock
      })
      Object.assign(products.value[editedIndex.value], editedItem.value)
    } else {
      // Add new product
      const newId = await productService.add({
        name: editedItem.value.name,
        price: editedItem.value.price,
        stock: editedItem.value.stock
      })
      editedItem.value.id = newId
      products.value.push(editedItem.value)
    }
    close()
  } catch (error) {
    console.error('Error saving product:', error)
  }
}

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(price)
}

// Load products on mount
onMounted(loadProducts)
</script>

<template>
  <div class="products page-container">
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="section-title mb-0">Products</h1>
      <v-btn
        color="primary"
        variant="flat"
        density="comfortable"
        prepend-icon="mdi-plus"
        @click="dialog = true"
      >
        Add
      </v-btn>
    </div>

    <v-card class="rounded-card mb-4">
      <v-card-text class="pa-2">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search products"
          variant="solo"
          density="compact"
          hide-details
          class="rounded-pill mb-2"
          bg-color="surface-variant"
        ></v-text-field>
      </v-card-text>
    </v-card>

    <v-card class="rounded-card">
      <v-data-table
        :headers="[
          { title: 'Name', key: 'name', align: 'start' },
          { title: 'Price', key: 'price', align: 'end' },
          { title: 'Stock', key: 'stock', align: 'end' },
          { title: '', key: 'actions', sortable: false, align: 'end' }
        ]"
        :items="products"
        :search="search"
        :loading="loading"
        loading-text="Loading products..."
        no-data-text="No products found"
        density="compact"
      >
        <template v-slot:item.price="{ item }">
          <span class="font-weight-medium">{{ formatPrice(item.price) }}</span>
        </template>

        <template v-slot:item.stock="{ item }">
          <v-chip
            :color="item.stock > 10 ? 'success' : item.stock > 0 ? 'warning' : 'error'"
            size="x-small"
            class="font-weight-medium"
          >
            {{ item.stock }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            density="compact"
            color="primary"
            size="small"
            class="mr-1"
            @click="editItem(item)"
          ></v-btn>
          <v-btn
            icon="mdi-delete"
            variant="text"
            density="compact"
            color="error"
            size="small"
            @click="deleteItem(item)"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="400px" class="rounded-card">
      <v-card class="rounded-card">
        <v-toolbar color="primary" class="text-white">
          <v-toolbar-title>{{ editedIndex === -1 ? 'New Product' : 'Edit Product' }}</v-toolbar-title>
          <template v-slot:append>
            <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
          </template>
        </v-toolbar>

        <v-card-text class="pt-4">
          <v-text-field
            v-model="editedItem.name"
            label="Product Name"
            variant="outlined"
            class="mb-3"
            required
          ></v-text-field>

          <v-text-field
            v-model.number="editedItem.price"
            label="Price"
            type="number"
            prefix="Rp"
            variant="outlined"
            class="mb-3"
            required
          ></v-text-field>

          <v-text-field
            v-model.number="editedItem.stock"
            label="Stock"
            type="number"
            variant="outlined"
            class="mb-3"
            required
          ></v-text-field>
        </v-card-text>

        <v-card-actions class="pb-4 px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="outlined"
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="save"
            class="ml-2"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.products {
  padding-bottom: 64px; /* Add padding for bottom navigation */
}
</style>
