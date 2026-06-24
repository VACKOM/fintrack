import styles from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

import {
  FaHome,
  FaWallet,
  FaExchangeAlt,
  FaChartPie,
  FaMoneyBillWave,
} from "react-icons/fa";

const Sidebar = () => {
  const getNavClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink;

  return (
    <aside className={styles.sidebar}>
      <img src={logo} alt="FinTrack Logo" className={styles.logo} />

      <nav className={styles.navLinks}>
        <NavLink to="/dashboard" className={getNavClass}>
          <FaHome className={styles.icon} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/accounts" className={getNavClass}>
          <FaWallet className={styles.icon} />
          <span>Accounts</span>
        </NavLink>

        <NavLink to="/transactions" className={getNavClass}>
          <FaExchangeAlt className={styles.icon} />
          <span>Transactions</span>
        </NavLink>

        <NavLink to="/budgets" className={getNavClass}>
          <FaChartPie className={styles.icon} />
          <span>Budgets</span>
        </NavLink>

        <NavLink to="/expenses" className={getNavClass}>
          <FaMoneyBillWave className={styles.icon} />
          <span>Expenses</span>
        </NavLink>
      </nav>

      <button className={styles.logoutBtn}>Logout</button>
    </aside>
  );
};

export default Sidebar;
