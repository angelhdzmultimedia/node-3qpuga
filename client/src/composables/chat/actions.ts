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
} from './state';
import { Notify } from 'quasar';
import { Message } from '../../types/message';

export async function connect(): Promise<void> {
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
  });

  socket.value.on('rooms', async (data: Room[]) => {
    rooms.value = data;
    await router.push(`/rooms`);
  });

  socket.value.on('connect', async () => {
    isConnected.value = true;
    socket.value.emit('userConnected', user.value.name);
  });
}

export async function disconnect(): Promise<void> {
  user.value = null;
  await router.push(`/`);
}

export function getRoomById(id: string): Room | null {
  return rooms.value.find((item) => item.id === id);
}

export async function joinRoom(roomId: string): Promise<void> {
  user.value.room = getRoomById(roomId);
  socket.value.emit('joinRoom', roomId);
  await router.push(`/rooms/${roomId}`);
}

export async function leaveRoom(): Promise<void> {
  //socket.value.emit('leaveRoom', user.value.room.id)
  user.value.room = null;
  await router.push(`/rooms`);
}

export function sendMessage(): void {
  socket.value.emit('newMessage', message.value);

  message.value = '';
}
