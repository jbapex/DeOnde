import React, { createContext, useContext, useState } from 'react';

const ModuleSettingsContext = createContext();

export const useModuleSettings = () => useContext(ModuleSettingsContext);

export const ModuleSettingsProvider = ({ children }) => {
  const [moduleSettings] = useState({ crm: true });
  const [loading] = useState(false);
  const hasPageAccess = () => true;
  return (
    <ModuleSettingsContext.Provider value={{ moduleSettings, loading, hasPageAccess }}>
      {children}
    </ModuleSettingsContext.Provider>
  );
};
