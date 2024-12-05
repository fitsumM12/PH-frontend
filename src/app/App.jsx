import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import { Theme } from "./components";
// ALL CONTEXTS
import { AuthProvider } from "./contexts/JWTAuthContext";
import SettingsProvider from "./contexts/SettingsContext";
import AppProvider from "./contexts/AppProvider";
// ROUTES
import routes from "./routes";


export default function App() {
  const content = useRoutes(routes);

  return (
    <SettingsProvider>
      <AuthProvider>
        <AppProvider>
          <Theme>
            <CssBaseline />
            {content}
          </Theme>
        </AppProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
