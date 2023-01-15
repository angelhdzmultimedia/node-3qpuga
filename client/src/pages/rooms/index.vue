<script setup lang="ts">
import { useChat } from '../../composables/chat';

definePage({
  meta: {
    requiresConnection: true,
  },
});

const chat = useChat();
</script>

<template>
  <div
    class="
      column
      full-width full-height
      items-center
      justify-center
      q-gutter-sm q-pt-md
    "
  >
    <span class="text-primary text-h4">Rooms</span>
    <div class="column q-gutter-sm">
      <q-btn
        @click="chat.joinRoom(room.id)"
        v-for="room in chat.rooms"
        :key="room.id"
        color="primary"
        :icon="room.locked ? 'lock' : undefined"
      >
        {{ room.label }}
      </q-btn>
    </div>
  </div>
</template>

<style scoped></style>
