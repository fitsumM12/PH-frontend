import React, { useReducer } from "react";
import { AppContext } from "app/hooks/useAppContext";
const initialState = {
  add_new_user: false,
  update_user: false,
  view_user: false,
  view_all_user: true
};

const reducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_ADD_NEW_USER":
      return { ...state, add_new_user: !state.add_new_user };
    case "TOGGLE_UPDATE_USER":
      return { ...state, update_user: !state.update_user };
    case "TOGGLE_VIEW_USER":
      return { ...state, view_user: !state.view_user };
    case "TOGGLE_VIEW_ALL_USER":
      return { ...state, view_user: !state.view_user };
    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export default AppProvider;
