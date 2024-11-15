import { createContext, useState } from "react";
import merge from "lodash/merge";
// CUSTOM COMPONENT
import { LayoutSettings } from "app/components/Layout/settings";

export const SettingsContext = createContext({
  settings: LayoutSettings,
  updateSettings: () => {}
});

export default function SettingsProvider({ settings, children }) {
  const [currentSettings, setCurrentSettings] = useState(settings || LayoutSettings);

  const handleUpdateSettings = (update = {}) => {
    const marged = merge({}, currentSettings, update);
    setCurrentSettings(marged);
  };

  return (
    <SettingsContext.Provider
      value={{ settings: currentSettings, updateSettings: handleUpdateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
