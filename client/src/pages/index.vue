<template>
  <div class="column full-height full-width items-center justify-center">
    <span class="text-h4 text-primary">Connection</span>
    <pre>{{ chat.username }}</pre>
    <q-form @submit.prevent="chat.connect" class="q-gutter-sm">
      <q-input
        @keydown.enter="chat.connect"
        v-model="chat.username"
        label="Username"
      ></q-input>
      <q-btn type="submit" color="primary">Connect</q-btn>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { useChat } from '../composables/chat';

const chat = useChat();
</script>
