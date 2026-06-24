import styles from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaWallet,
  FaExchangeAlt,
  FaChartPie,
  FaMoneyBillWave,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>FinTrack</h2>
      <nav className={styles.navLinks}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.NavLink
          }
        >
          <FaHome />
          Dashboard
        </NavLink>
        <NavLink to="/accounts">
          <FaWallet />
          <span>Accounts</span>
        </NavLink>
        <NavLink to="/transactions">
          <FaExchangeAlt />
          <span>Transactions</span>
        </NavLink>

        <NavLink to="/budgets">
          <FaChartPie />
          <span>Budgets</span>
        </NavLink>
        <NavLink to="/expenses">
          <FaMoneyBillWave />
          <span>Expenses</span>
        </NavLink>
      </nav>

      <button className={styles.logoutBtn}>Logout</button>
    </aside>
  );
};

export default Sidebar;
