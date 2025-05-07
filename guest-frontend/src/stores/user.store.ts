import { createStore } from 'solid-js/store';

export const [userFromStore, setUserFromStore] = createStore({
  id: '',
  username: '',
  phone: '',
  email: ''
});

export const updateUserFromStore = (data: {id: string, username: string, phone: string, email: string}) => {
  setUserFromStore({
    id: data.id,
    username: data.username,
    phone: data.phone,
    email: data.email
  });
};