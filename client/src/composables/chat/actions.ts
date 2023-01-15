import io from 'socket.io-client';
import { router } from '../../router';
import { Room } from '../../types/room';
import { User } from '../../types/user';
import {
  user,
  rooms,
  message,
  messages,
  username,
  socket,
  isConnected,
  messagesListRef,
  isConnecting,
  usersList,
  isUsersListOpen,
} from './state';
import { Dialog, Notify } from 'quasar';
import { Message } from '../../types/message';
import { nextTick } from 'vue';
import { wait } from '../../utils/timer';

function updateMessagesList(): void {
  nextTick(() => {
    messagesListRef.value &&
      messagesListRef.value.scrollTo(messages.value.length);
  });
}

export async function connect(): Promise<void> {
  isConnecting.value = true;
  await router.push('/connecting');
  await wait(1000);
  user.value.name = username.value;
  socket.value = io('http://localhost:5000', { reconnectionAttempts: 5 });

  socket.value.on('userConnected', (data: User) => {
    Notify.create({
      message: `User connected: ${data}`,
      color: 'positive',
    });
  });

  socket.value.on('broadcast', (data: Message) => {
    messages.value.push({
      content: data.content,
      id: data.id,
      user: data.user,
      color: 'primary',
      type: 'broadcast',
    });
    updateMessagesList();
  });

  socket.value.on('connect_error', () => {
    router.push('/');
  });

  socket.value.on('notifyModeration', (data: Message) => {
    messages.value.push({
      content: data.content,
      id: data.id,
      user: data.user,
      color: 'red',
      type: 'notify',
      icon: 'notifications',
    });
    updateMessagesList();
  });

  socket.value.on('kicked', (data: Message) => {
    leaveRoom();
    Dialog.create({
      title: 'Moderation Notification',
      message: data.content,
      color: 'negative',
    });
  });

  socket.value.on('notify', (data: Message) => {
    messages.value.push({
      content: data.content,
      id: data.id,
      user: data.user,
      color: 'teal-14',
      type: 'notify',
    });
    updateMessagesList();
  });

  socket.value.on('rooms', async (data: Room[]) => {
    rooms.value = data;
    await router.push(`/rooms`);
  });

  socket.value.on('users', async (data: string[]) => {
    usersList.value = data;
  });

  socket.value.on('connect', async () => {
    isConnecting.value = false;
    isConnected.value = true;
    socket.value.emit('userConnected', user.value.name);
  });
}

export async function disconnect(): Promise<void> {
  if (!isConnected.value) {
    return (await router.push('/')) as void;
  }
  Dialog.create({
    title: 'Disconnection Notification',
    message: 'Are you sure?',
    persistent: true,
    color: 'negative',
    cancel: true,
  }).onOk(async () => {
    await leaveRoom();
    rooms.value = [];
    isConnected.value = false;
    await router.push('/');
    user.value = {
      id: null,
      name: null,
      room: null,
    };
    socket.value.disconnect();
  });
}

export function getRoomById(id: string): Room | null {
  return rooms.value.find((item) => item.id === id);
}

export async function joinRoom(roomId: string): Promise<void> {
  user.value.room = getRoomById(roomId);
  socket.value.emit('joinRoom', roomId);
  await router.push(`/rooms/${roomId}`);
}

export function toggleUsersList(): void {
  isUsersListOpen.value = !isUsersListOpen.value;
}

export async function leaveRoom(): Promise<void> {
  if (!user.value.room) return;
  socket.value.emit('leaveRoom', user.value.room.id);
  messages.value = [];
  message.value = '';
  usersList.value = [];
  user.value.room = null;
  await router.push(`/rooms`);
}

export function sendMessage(): void {
  socket.value.emit('newMessage', message.value);

  message.value = '';
}
