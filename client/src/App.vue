<template>
  <router-view :key="$route.path" />
</template>

<script setup lang="ts">
import { Dark } from 'quasar';
Dark.set(true);
</script>
