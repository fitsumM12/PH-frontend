import { createContext, useReducer } from "react";
import axios from "axios";
import { Loading } from "app/components";
import api from "app/apis/check_access";
import { useEffect } from "react";

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
  login: () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/login/", { email, password });
      const { user, token, refresh_token } = response.data;

      if (user.status.toUpperCase() === 'BLOCKED') {
        alert("Your account is blocked. Please contact support.");
        return;
      } else if (user.status.toUpperCase() === 'PENDING') {
        alert("Your account is pending approval. Please contact support.");
        return;
      } else if (user.status.toUpperCase() !== 'APPROVED') {
        alert("Your account is not approved yet. Please contact support.");
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('refresh_token', refresh_token);
      dispatch({ type: "LOGIN", payload: { user } });

    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem("token");
      const refresh_token = localStorage.getItem("refresh_token");

      if (token && refresh_token) {
        try {
          api.defaults.headers["Authorization"] = "Bearer " + token;
          const response = await api.get("/users/");
          const user = response.data;

          if (user.status.toUpperCase()  === 'BLOCKED') {
            alert("Your account is blocked. Please contact support.");
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            dispatch({ type: "LOGOUT" });
            return;
          } else if (user.status.toUpperCase()  === 'PENDING') {
            alert("Your account is pending approval. Please contact support.");
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            dispatch({ type: "LOGOUT" });
            return;
          } else if (user.status.toUpperCase()  !== 'APPROVED') {
            alert("Your account is not approved yet. Please contact support.");
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            dispatch({ type: "LOGOUT" });
            return;
          }

          dispatch({
            type: "INIT",
            payload: { isAuthenticated: true, user },
          });
        } catch (error) {
          console.error("Error during token validation:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          dispatch({ type: "LOGOUT" });
        }
      } else {
        dispatch({
          type: "INIT",
          payload: { isAuthenticated: false, user: null },
        });
      }
    };

    initialize();
  }, []);

  if (!state.isInitialized) return <Loading />;

  return (
    <AuthContext.Provider value={{ ...state, method: "JWT", login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
