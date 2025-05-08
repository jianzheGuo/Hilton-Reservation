import { createStore } from "solid-js/store";

const sessionUser = JSON.parse(sessionStorage.getItem("userData") || "{}");
export const [userFromStore, setUserFromStore] = createStore({
  id: sessionUser?.id,
  username: sessionUser?.username,
  phone: sessionUser?.phone,
  email: sessionUser?.email
});

export const updateUserFromStore = (data: {id: string, username: string, phone: string, email: string}) => {
  setUserFromStore({
    id: data.id,
    username: data.username,
    phone: data.phone,
    email: data.email
  });
};