import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const success = login(username, password);

    if (success) {
      navigate("/dashboard");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🔐 SecureAuth</h1>
        <p>JWT Authentication System</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Login
          </button>
        </form>

        <div className="demo-box">
          <h3>Demo Accounts</h3>

          <p>Admin : admin / admin123</p>
          <p>Editor : editor / editor123</p>
          <p>Viewer : viewer / viewer123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;