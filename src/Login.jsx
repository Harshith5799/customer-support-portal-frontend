import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    try {

      const response = await axios.post(
        "http://localhost:8080/auth/login",
        {
          username,
          password
        }
      );

  localStorage.setItem("token", response.data.token);
localStorage.setItem("role", response.data.role);

onLogin();

    } catch (error) {

      alert("Invalid Username or Password");

    }
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0f172a,#1e293b,#334155)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Segoe UI"
      }}
    >

      <div
        style={{
          width: "400px",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          padding: "40px",
          borderRadius: "25px",
          boxShadow:
            "0 15px 35px rgba(0,0,0,0.3)",
          textAlign: "center"
        }}
      >

        <div
          style={{
            fontSize: "60px",
            marginBottom: "10px"
          }}
        >
          🎫
        </div>

        <h1
          style={{
            color: "white",
            marginBottom: "30px"
          }}
        >
          Customer Support Portal
        </h1>

        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "12px",
            border: "none",
            outline: "none",
            fontSize: "15px",
            boxSizing: "border-box"
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "25px",
            borderRadius: "12px",
            border: "none",
            outline: "none",
            fontSize: "15px",
            boxSizing: "border-box"
          }}
        />

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: "12px",
            background:
              "linear-gradient(135deg,#2563eb,#3b82f6)",
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Login
        </button>

        <div
          style={{
            marginTop: "25px",
            color: "#cbd5e1",
            fontSize: "14px"
          }}
        >
          <b>Demo Credentials</b>

          <br /><br />

          <b>Admin:</b>
          <br />
          admin / admin123

          <br /><br />

          <b>Customer:</b>
          <br />
          customer / customer123

        </div>

      </div>

    </div>

  );
}

export default Login;