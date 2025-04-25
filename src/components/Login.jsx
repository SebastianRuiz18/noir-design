// src/components/Login.jsx
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

function Login({ onLogin }) {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLogin(user); // manda el usuario al componente padre
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Hubo un problema al iniciar sesión.");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Iniciar sesión</h2>
      <button onClick={handleLogin} style={{
        backgroundColor: "#4285F4",
        color: "#fff",
        padding: "10px 20px",
        fontSize: "1rem",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
      }}>
        Iniciar sesión con Google
      </button>
    </div>
  );
}

export default Login;