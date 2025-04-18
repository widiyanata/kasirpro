<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../stores/auth';

// Router
const router = useRouter();

// Auth store
const { register, loading, error } = useAuth();

// Form data
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const formError = ref('');

// Register with email and password
const handleRegister = async () => {
  if (!email.value || !password.value || !confirmPassword.value) {
    formError.value = 'Please fill in all fields';
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    formError.value = 'Passwords do not match';
    return;
  }
  
  formError.value = '';
  
  try {
    await register(email.value, password.value);
    router.push('/');
  } catch (err: any) {
    formError.value = err.message || 'Registration failed';
  }
};

// Navigate to login
const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="register-view">
    <v-container class="fill-height">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="rounded-lg elevation-4">
            <v-card-title class="text-center pt-8 pb-4">
              <h1 class="text-h4 font-weight-bold primary--text">KasirKilat</h1>
              <p class="text-subtitle-1 mt-2">Create a new account</p>
            </v-card-title>
            
            <v-card-text>
              <v-alert
                v-if="formError"
                type="error"
                variant="tonal"
                density="compact"
                class="mb-4"
              >
                {{ formError }}
              </v-alert>
              
              <v-form @submit.prevent="handleRegister">
                <v-text-field
                  v-model="email"
                  label="Email"
                  type="email"
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  required
                ></v-text-field>
                
                <v-text-field
                  v-model="password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  required
                  @click:append-inner="showPassword = !showPassword"
                ></v-text-field>
                
                <v-text-field
                  v-model="confirmPassword"
                  label="Confirm Password"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  variant="outlined"
                  density="comfortable"
                  class="mb-6"
                  required
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                ></v-text-field>
                
                <v-btn
                  type="submit"
                  color="primary"
                  block
                  size="large"
                  :loading="loading"
                  class="mb-6"
                >
                  Sign Up
                </v-btn>
                
                <div class="text-center">
                  <span class="text-body-2">Already have an account?</span>
                  <v-btn
                    variant="text"
                    color="primary"
                    class="ml-2"
                    @click="goToLogin"
                  >
                    Sign In
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.register-view {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
