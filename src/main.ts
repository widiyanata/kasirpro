import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Import Vuetify
import vuetify from './plugins/vuetify'

// Import Router
import router from './router'

// Import DB service
import { initDB } from './services/db'

// Initialize the database
initDB().catch(error => {
  console.error('Failed to initialize database:', error)
})

// Create the app
const app = createApp(App)

// Use plugins
app.use(vuetify)
app.use(router)

// Mount the app
app.mount('#app')
