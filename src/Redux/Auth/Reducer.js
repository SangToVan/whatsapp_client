import {
  LOGIN,
  REGISTER,
  REQ_USER,
  SEARCH_USER,
  UPDATE_USER,
} from "./ActionType";

const initialValue = {
  signup: null, // Holds data related to user registration
  signin: null, // Holds data related to user login
  reqUser: null, // Holds data related to the current user
  searchUser: null, // Holds data related to user search
  updateUser: null, // Holds data related to user updates
};

export const authReducer = (store = initialValue, { type, payload }) => {
  if (type === REGISTER) {
    return { ...store, signup: payload };
  } else if (type === LOGIN) {
    return { ...store, signin: payload };
  } else if (type === REQ_USER) {
    return { ...store, reqUser: payload };
  } else if (type === SEARCH_USER) {
    return { ...store, searchUser: payload };
  } else if (type === UPDATE_USER) {
    return { ...store, updateUser: payload };
  }
  return store;
};
