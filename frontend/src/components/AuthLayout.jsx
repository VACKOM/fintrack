import styles from "./AuthLayout.module.css";
import logo from "../assets/logo.png";

const AuthLayout = ({ title, children }) => {
  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <img src={logo} alt="FinTrack Logo" className={styles.logo} />

        <h2>{title}</h2>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
