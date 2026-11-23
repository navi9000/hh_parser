<script setup lang="ts">
import { ref } from 'vue';

const isStarting = ref(false);
const errorMessage = ref('');

async function startBrowser() {
  isStarting.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch('http://127.0.0.1:3000/browser/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://hh.ru' }),
    });

    if (!response.ok) {
      throw new Error(`Browser start failed with status ${response.status}`);
    }
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Failed to start browser';
  } finally {
    isStarting.value = false;
  }
}
</script>

<template>
  <main>
    <button type="button" :disabled="isStarting" @click="startBrowser">
      Run
    </button>
    <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
  </main>
</template>
