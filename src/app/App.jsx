import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import { Theme } from "./components";
// ALL CONTEXTS
import { AuthProvider } from "./contexts/JWTAuthContext";
import SettingsProvider from "./contexts/SettingsContext";
import AppProvider from "./contexts/AppProvider";
import ProfileContextProvider from "./contexts/profileContextProvider";   
// ROUTES

import routes from "./routes";


export default function App() {
  const content = useRoutes(routes);

  return (
    <SettingsProvider>
      <AuthProvider>
        <AppProvider>
          <ProfileContextProvider>
          <Theme>
            <CssBaseline />
            {content}
          </Theme>
          </ProfileContextProvider>
        </AppProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}