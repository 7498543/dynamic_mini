<template>
  <div>
    <u-form>
      <u-form-field label="Username" prop="username">
        <u-input
          v-model="loginForm.username"
          :placeholder="$t('form.placeholder', { field: 'username' })"
        />
      </u-form-field>
      <u-form-field label="Password" prop="password">
        <u-input
          v-model="loginForm.password"
          type="password"
          :placeholder="$t('form.placeholder', { field: 'password' })"
        />
      </u-form-field>
    </u-form>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
const loginForm = ref({
  username: '',
  password: '',
});

const loginSchema = z.object({
  username: z.string().min(1, 'Please input username'),
  password: z.string().min(6, 'Please input password'),
});
</script>
