<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="home"
          aria-label="Menu"
          @click="chat.disconnect"
        />

        <q-toolbar-title>
          <q-breadcrumbs active-color="cyan-3">
            <q-breadcrumbs-el>VueChat</q-breadcrumbs-el>
            <q-breadcrumbs-el v-if="chat.isConnected">Rooms</q-breadcrumbs-el>
            <q-breadcrumbs-el v-if="chat.isConnected && chat.user.room">{{
              chat.user.room.label
            }}</q-breadcrumbs-el>
          </q-breadcrumbs>
        </q-toolbar-title>

        <div>
          <q-chip
            text-color="white"
            :color="chat.isConnected ? 'positive' : 'negative'"
            >{{ chat.isConnected ? 'Connected' : 'Disconnected' }}</q-chip
          >
          <span>
            {{ chat.isConnected ? chat.user.name : 'Guest' }}
          </span>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      class="column items-center"
      v-model="chat.isUsersListOpen"
      show-if-above
      bordered
      side="right"
      :overlay="false"
      :persistent="false"
      :key="$route.path"
    >
      <span class="text-h6"
        >Connected Users
        <span class="text-cyan-3"> {{ chat.usersList.length }}/999 </span>
      </span>
      <span
        v-if="chat.isConnected && chat.user.room && chat.usersList.length === 0"
        >No users.</span
      >
      <q-list>
        <q-item class="text-cyan-3" v-for="username in chat.usersList">
          {{ username }}
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="window-width window-height">
      <q-page class="column full-width full-height"> <router-view /></q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useChat } from '../composables/chat';

const chat = useChat();
</script>
