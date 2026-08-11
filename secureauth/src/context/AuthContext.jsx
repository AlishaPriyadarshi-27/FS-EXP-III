import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const users = [
    {
      username: "admin",
      password: "admin123",
      role: "admin",
    },
    {
      username: "editor",
      password: "editor123",
      role: "editor",
    },
    {
      username: "viewer",
      password: "viewer123",
      role: "viewer",
    },
  ];

  const login = (username, password) => {
    const foundUser = users.find(
      (u) =>
        u.username === username &&
        u.password === password
    );

    if (foundUser) {
      const token = btoa(JSON.stringify(foundUser));

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(foundUser)
      );

      setUser(foundUser);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};