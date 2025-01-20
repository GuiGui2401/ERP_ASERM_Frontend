import React, { createContext, useState, useEffect } from 'react';

export const ModuleContext = createContext();

export const ModuleProvider = ({ children }) => {
  const [selectedModule, setSelectedModuleState] = useState(() => {
    // Utilisez une fonction de rappel pour récupérer la valeur initiale à partir du stockage local
    const savedModule = localStorage.getItem('selectedModule');
    return savedModule ? savedModule : 'Global'; // Utilisez 'Global' si aucune valeur n'est trouvée dans le stockage local
  });

  const handleModuleClick = (key) => {
    setSelectedModuleState(key);
  };

  // Utilisez useEffect pour sauvegarder l'état dans le stockage local chaque fois qu'il change
  useEffect(() => {
    localStorage.setItem('selectedModule', selectedModule);
  }, [selectedModule]);

  return (
    <ModuleContext.Provider value={{ selectedModule, handleModuleClick }}>
      {children}
    </ModuleContext.Provider>
  );
};
