<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../stores/auth';

// Router
const router = useRouter();

// Auth store
const { login, loginWithGoogle, loading, error } = useAuth();

// Form data
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const formError = ref('');

// Login with email and password
const handleLogin = async () => {
  if (!email.value || !password.value) {
    formError.value = 'Please enter email and password';
    return;
  }
  
  formError.value = '';
  
  try {
    await login(email.value, password.value);
    router.push('/');
  } catch (err: any) {
    formError.value = err.message || 'Login failed';
  }
};

// Login with Google
const handleGoogleLogin = async () => {
  formError.value = '';
  
  try {
    await loginWithGoogle();
    router.push('/');
  } catch (err: any) {
    formError.value = err.message || 'Google login failed';
  }
};

// Navigate to register
const goToRegister = () => {
  router.push('/register');
};
</script>

<template>
  <div class="login-view">
    <v-container class="fill-height">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="rounded-lg elevation-4">
            <v-card-title class="text-center pt-8 pb-4">
              <h1 class="text-h4 font-weight-bold primary--text">KasirKilat</h1>
              <p class="text-subtitle-1 mt-2">Sign in to your account</p>
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
              
              <v-form @submit.prevent="handleLogin">
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
                  class="mb-6"
                  required
                  @click:append-inner="showPassword = !showPassword"
                ></v-text-field>
                
                <v-btn
                  type="submit"
                  color="primary"
                  block
                  size="large"
                  :loading="loading"
                  class="mb-4"
                >
                  Sign In
                </v-btn>
              </v-form>
              
              <div class="text-center my-4">
                <span class="text-body-2">or continue with</span>
              </div>
              
              <v-btn
                color="error"
                variant="outlined"
                block
                size="large"
                prepend-icon="mdi-google"
                :loading="loading"
                class="mb-6"
                @click="handleGoogleLogin"
              >
                Google (Pro Version)
              </v-btn>
              
              <div class="text-center">
                <span class="text-body-2">Don't have an account?</span>
                <v-btn
                  variant="text"
                  color="primary"
                  class="ml-2"
                  @click="goToRegister"
                >
                  Sign Up
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
