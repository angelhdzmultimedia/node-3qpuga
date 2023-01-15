import {
  user,
  username,
  socket,
  rooms,
  isConnected,
  messages,
  message,
  messagesListRef,
} from './state';
import { connect, joinRoom, leaveRoom, sendMessage } from './actions';
import { reactive } from 'vue';

export const useChat = () => {
  return reactive({
    sendMessage,
    leaveRoom,
    messagesListRef,
    isConnected,
    user,
    username,
    connect,
    socket,
    rooms,
    joinRoom,
    messages,
    message,
  });
};
