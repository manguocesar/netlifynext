import React, { useState, useEffect, createContext } from "react";
import netlifyIdentity from "netlify-identity-widget";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  authReady: false,
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // on login
    netlifyIdentity.on("login", (user) => {
      setUser(user);
      netlifyIdentity.close();
    });

    // on logout
    netlifyIdentity.on("logout", (user) => {
      setUser(null);
    });

    // connect with Netlify Identity
    netlifyIdentity.init();
    
    return () => {
      netlifyIdentity.off("login");
      netlifyIdentity.off("logout");
    };
  }, []);

  const login = () => {
    netlifyIdentity.open();
  };

  const logout = () => {
    netlifyIdentity.logout();
  };

  const context = {
    login,
    logout,
    user,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
