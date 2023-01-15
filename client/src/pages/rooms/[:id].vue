<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useChat } from 'src/composables/chat';
import { definePage } from 'vue-router/auto';

definePage({
  meta: {
    requiresConnection: true,
  },
});

const chat = useChat();
</script>

<template>
  <div class="column items-center q-gutter-sm">
    <pre>
TODO: Move back button to toolbar replacing Home Button for Navigate Back</pre
    >
    <q-btn @click="chat.leaveRoom" color="primary">Back</q-btn>
    <q-card elevated class="full-width q-pa-md">
      <q-virtual-scroll
        :items="chat.messages"
        v-slot="{ item: message, index }"
        style="height: 200px; max-height: 200px"
        :ref="(el) => (chat.messagesListRef as any) = el"
        padding
        bordered
        class="full-width"
      >
        <q-item
          :key="index"
          class="full-width"
          v-if="message.type === 'broadcast'"
        >
          <q-item-section>
            <span class="text-weight-bold text-primary">
              {{ message.user.name }}:&nbsp;
            </span>
            <span>{{ message.content }}</span>
          </q-item-section>
        </q-item>
        <q-item
          :key="index"
          v-if="message.type === 'notify'"
          :class="[
            'row',
            'full-width',
            'text-weight-bold',
            'text-italic',
            `text-${message.color}`,
          ]"
        >
          <q-item-section class="row">
            <q-icon
              size="1.5.em"
              :color="message.color"
              v-if="message.icon"
              :name="message.icon"
            ></q-icon>
            <span>{{ message.content }}</span>
          </q-item-section>
        </q-item>
      </q-virtual-scroll>
      <q-input
        @keydown.enter="chat.sendMessage"
        v-model="chat.message"
        label="Message"
      >
        <template #append>
          <q-btn @click="chat.sendMessage" icon="send" color="primary"></q-btn>
        </template>
      </q-input>
    </q-card>
  </div>
</template>

<style scoped></style>
