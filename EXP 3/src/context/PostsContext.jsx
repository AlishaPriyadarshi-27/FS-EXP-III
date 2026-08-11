import { createContext, useState } from "react";

export const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts] = useState([
    {
      id: 1,
      title: "Getting Started with React",
      author: "admin",
      category: "React",
    },
    {
      id: 2,
      title: "Understanding JWT Authentication",
      author: "editor",
      category: "Security",
    },
    {
      id: 3,
      title: "Role Based Access Control",
      author: "admin",
      category: "Authentication",
    },
    {
      id: 4,
      title: "React Router DOM",
      author: "editor",
      category: "React",
    },
  ]);

  return (
    <PostsContext.Provider value={{ posts }}>
      {children}
    </PostsContext.Provider>
  );
};