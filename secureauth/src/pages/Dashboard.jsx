import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { PostsContext } from "../context/PostsContext";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const { posts } = useContext(PostsContext);

  const [allPosts, setAllPosts] = useState(posts);

  const handleEdit = (id) => {
    const newTitle = prompt("Enter New Title");

    if (newTitle) {
      const updatedPosts = allPosts.map((post) =>
        post.id === id
          ? { ...post, title: newTitle }
          : post
      );

      setAllPosts(updatedPosts);
      alert("Post Updated Successfully!");
    }
  };

  const handleDelete = (id) => {
    const updatedPosts = allPosts.filter(
      (post) => post.id !== id
    );

    setAllPosts(updatedPosts);
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <h3>Welcome Back, {user.username}</h3>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {allPosts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.author}</td>
              <td>{post.category}</td>

              <td>
                {(user.role === "admin" ||
                  user.role === "editor") && (
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(post.id)}
                  >
                    Edit
                  </button>
                )}

                {user.role === "admin" && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                )}

                {user.role === "viewer" && (
                  <span className="view-only">
                    View Only
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;