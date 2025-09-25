// ConnectionContext.js
import React, { createContext, useState, useContext } from 'react';

const ConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
  const [connections, setConnections] = useState({});

  const updateConnection = (id, status) => {
    setConnections(prev => ({
      ...prev,
      [id]: status
    }));
  };

  return (
    <ConnectionContext.Provider value={{ connections, updateConnection }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => useContext(ConnectionContext);