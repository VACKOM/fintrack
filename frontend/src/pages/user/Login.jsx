import api from "../../api/axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import AuthLayout from "../../components/AuthLayout";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    setError("");
    setSuccess("");
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log(response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }

      setSuccess(response.data.message || "Successful Login");
    } catch (error) {
      setError(error.response.data.message || "Login Failed");
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      {success && <p className={styles.successMessage}>{success}</p>}

      {error && <p className={styles.errorMessage}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={styles.loginBtn}>
          Login
        </button>
      </form>
      <p className={styles.footerText}>
        Don't have an account?{" "}
        <Link to="/register" className={styles.link}>
          Register
        </Link>
      </p>
    </AuthLayout>
  );
};
export default Login;
