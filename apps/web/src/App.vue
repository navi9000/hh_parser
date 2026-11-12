<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <main class="page">
    <section class="card">
      <p class="eyebrow">Vue + Vite</p>
      <h1>HH Scraper</h1>
      <p class="description">
        Your Vue app is ready. Start building your experience here.
      </p>
      <button type="button" @click="count++">
        Clicked {{ count }} {{ count === 1 ? 'time' : 'times' }}
      </button>
    </section>
  </main>
</template>
