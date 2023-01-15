import { ref } from 'vue';
import { Message } from '../../types/message';
import { Room } from '../../types/room';
import { User } from '../../types/user';
import { Socket } from 'socket.io-client';
import { QDrawer, QVirtualScroll } from 'quasar';

export const isUsersListOpen = ref<boolean>(false);
export const usersList = ref<string[]>([]);
export const isConnecting = ref<boolean>(false);
export const username = ref<string>('');
export const messages = ref<Message[]>([]);
export const message = ref<string>('');
export const socket = ref<Socket | null>(null);
export const isConnected = ref<boolean>(false);
export const messagesListRef = ref<QVirtualScroll | null>(null);
export const user = ref<User>({
  id: null,
  name: null,
  room: null,
});

export const rooms = ref([]);
