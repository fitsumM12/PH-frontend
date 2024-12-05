import { createContext, useReducer } from "react";
import axios from "axios";
import { Loading } from "app/components";

const initialState = {
  user: null,
  isInitialized: true,
  isAuthenticated: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialized: true, user };
    }

    case "LOGIN": {
      return { ...state, isAuthenticated: true, user: action.payload.user };
    }

    case "LOGOUT": {
      return { ...state, isAuthenticated: false, user: null };
    }

    
    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  method: "JWT",
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/login/", { email, password });
      const { user, token,refresh_token } = response.data;
      localStorage.setItem('token', token); 
      localStorage.setItem('refresh_token', refresh_token); 
      dispatch({ type: "LOGIN", payload: { user } });
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('refresh_token'); 
    dispatch({ type: "LOGOUT" });
  };

  if (!state.isInitialized) return <Loading />;

  return (
    <AuthContext.Provider value={{ ...state, method: "JWT", login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
