import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Import Vuetify
import vuetify from './plugins/vuetify'

// Import Router
import router from './router'

// Import DB services
import { initDB } from './services/db'
import { initUserDB } from './services/auth'

// Initialize the databases
Promise.all([
  initDB().catch(error => {
    console.error('Failed to initialize main database:', error)
  }),
  initUserDB().catch(error => {
    console.error('Failed to initialize user database:', error)
  })
])

// Create the app
const app = createApp(App)

// Use plugins
app.use(vuetify)
app.use(router)

// Mount the app
app.mount('#app')
