import styles from "./Dashboard.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";

const Dashboard = () => {
  const accounts = [
    { name: "Salary Account", balance: 25000 },
    { name: "Investment Account", balance: 32000 },
    { name: "Savings Account", balance: 12000 },
  ];

  const upcomingExpenses = [
    { name: "Rent", amount: 1600 },
    { name: "DSTV", amount: 190 },
    { name: "Feeding Fee", amount: 400 },
  ];
  const exceededExpense = [
    { name: "Food", over: 540 },
    { name: "Transportation", over: 300 },
    { name: "Internet", over: 600 },
  ];

  return (
    <div className={styles.dashboardPage}>
      <Sidebar />

      <main className={styles.dashboard}>
        <h1>Dashboard</h1>
        {/* ROW 1 */}
        <div className={styles.row1}>
          <div className={styles.card}>
            <h3>Total Income</h3>
            <h2>GHS 8,500</h2>
            <p>Actual income against predicted income</p>
          </div>
          <div className={styles.card}>
            <h3>Total Expenses</h3>
            <h2>GHS 4,200</h2>
            <p>Actual expenses against predicted expenses</p>
          </div>
          <div className={styles.card}>
            <h3>Account Balances</h3>

            {accounts.map((account) => (
              <div className={styles.accountItem} key={account.name}>
                <span>{account.name}</span>
                <strong>GHS {account.balance}</strong>
              </div>
            ))}
          </div>
        </div>

        {/*Row 2*/}
        <div className={styles.row2}>
          <div className={styles.card}>
            <h3>Income vs Expenses Chart</h3>
            <div className={styles.chartPlaceholder}>line Chart goes here</div>
          </div>

          <div className={styles.card}>
            <h3>Upcoming Expenses</h3>
            {upcomingExpenses.map((expense) => (
              <div className={styles.accountItem} key={expense.name}>
                <span>{expense.name}</span>
                <strong>GHS {expense.amount}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3*/}
        <div className={styles.row3}>
          <div className={styles.card}>
            <h3>Budget Categories</h3>
            <div className={styles.chartPlaceholder}>Bar Chart Goes Here</div>
          </div>
          <div className={styles.card}>
            <h3>Exceeded Expenses</h3>
            {exceededExpense.map((item) => (
              <div className={styles.warningItem} key={item.name}>
                <span>{item.name}</span>
                <strong> GHS{item.over}</strong>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
export default Dashboard;
