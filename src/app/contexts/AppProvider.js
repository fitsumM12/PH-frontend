import React, { useReducer } from "react";
import { AppContext } from "app/hooks/useAppContext";
const initialState = {
  new_screening: false,
  currentPatiientId: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "START_NEW_SCREENING":
      return {
        ...state, new_screening: true,
        currentPatientId: action.payload
      };
    case "STOP_NEW_SCREENING":
      return {
        ...state, new_screening: false
      };
    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export default AppProvider;
