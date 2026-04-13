import React, { createContext, useState } from "react";

export const authDataContext = createContext();

function AuthContext({ children }) {
  const serverUrl = "http://localhost:8000";

  const [loading, setLoading] = useState(false);

  const value = {
    serverUrl,
    loading,
    setLoading,
  };

  return (
    <authDataContext.Provider value={value}>
      {children}
    </authDataContext.Provider>
  );
}

export default AuthContext;
