// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { md3 } from 'vuetify/blueprints'
import '@mdi/font/css/materialdesignicons.css'

// Create Vuetify instance with MD3 blueprint
export default createVuetify({
  components,
  directives,
  blueprint: md3,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#6750A4',   // Modern purple
          secondary: '#958DA5', // Muted purple
          tertiary: '#B58392',  // Dusty rose
          surface: '#FFFBFE',   // Off-white
          background: '#FFFBFE', // Off-white
          error: '#B3261E',     // Deep red
          info: '#2196F3',      // Blue
          success: '#146C2E',    // Deep green
          warning: '#FF8800'     // Orange
        }
      },
      dark: {
        colors: {
          primary: '#D0BCFF',    // Light purple
          secondary: '#CCC2DC',  // Light muted purple
          tertiary: '#EFB8C8',   // Light pink
          surface: '#1C1B1F',    // Dark gray
          background: '#1C1B1F',  // Dark gray
          error: '#F2B8B5',      // Light red
          info: '#90CAF9',       // Light blue
          success: '#7CB342',    // Light green
          warning: '#FFB74D'      // Light orange
        }
      }
    }
  },
  defaults: {
    VCard: {
      rounded: 'lg',
      elevation: 0,
      class: 'border'
    },
    VBtn: {
      rounded: 'lg',
      elevation: 0
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary'
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary'
    }
  }
})
