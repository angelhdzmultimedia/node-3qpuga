import * as state from './state';
import * as actions from './actions';
import { reactive } from 'vue';

export const useChat = () => {
  return reactive({
    ...state,
    ...actions,
  });
};
