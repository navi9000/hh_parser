<script setup lang="ts">
import { useStartBrowser } from "../model/useStartBrowser"

const { isStarting, errorMessage, start } = useStartBrowser()
</script>

<template>
  <button :disabled="isStarting" @click="start">Run</button>
  <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
</template>
