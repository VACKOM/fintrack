import styles from "./Dashboard.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { getDashboardSummary } from "../../services/dashboardService";
import { getAllAccounts } from "../../services/accountServices";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";
const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
  });
  const [accounts, setAccounts] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getDashboardSummary();
        setSummary(data.summary);
        console.log(data);
      } catch (error) {
        console.log(error);
        setError("Failed to load Dashboard Summary");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getAllAccounts();
        console.log(data);
        setAccounts(data.accounts);
      } catch (error) {
        console.log(error);
        setError("Failed to load Accounts records");
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  //   const accounts = [
  //     { name: "Salary Account", balance: 25000 },
  //     { name: "Investment Account", balance: 32000 },
  //     { name: "Savings Account", balance: 12000 },
  //   ];

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

  const incomeChartData = [
    { name: "Actual Income", value: 7500, fill: "#ffffff" },
    { name: "Outstanding Income", value: 1000, fill: "#93c5fd" },
  ];

  const expenseChartData = [
    { name: "Actual Expense", value: 5000, fill: "#ffffff" },
    { name: "Outstanding Expense", value: 2500, fill: "#93c5fd" },
  ];

  const incomePercentage = Math.round((7500 / 8500) * 100);
  const expensePercentage = Math.round((3500 / 4200) * 100);

  const monthlyFinanceData = [
    { month: "Jan", income: 8500, expenses: 4200 },
    { month: "Feb", income: 8700, expenses: 4600 },
    { month: "Mar", income: 9200, expenses: 5100 },
    { month: "Apr", income: 8800, expenses: 4800 },
    { month: "May", income: 9500, expenses: 5300 },
    { month: "Jun", income: 10000, expenses: 15700 },
    { month: "Jul", income: 9700, expenses: 6000 },
    { month: "Aug", income: 10500, expenses: 6200 },
    { month: "Sep", income: 11000, expenses: 6500 },
    { month: "Oct", income: 10800, expenses: 16300 },
    { month: "Nov", income: 11500, expenses: 6800 },
    { month: "Dec", income: 12000, expenses: 7200 },
  ];

  const budgetData = [
    { item: "Rent", value: 1600 },
    { item: "Food", value: 1200 },
    { item: "Transport", value: 800 },
    { item: "Utilities", value: 650 },
    { item: "Internet", value: 400 },
    { item: "DSTV", value: 190 },
  ];

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.dashboardPage}>
      <Sidebar />

      <main className={styles.dashboard}>
        <h1>Dashboard</h1>
        {/* ROW 1 */}
        <div className={styles.row1}>
          <div className={styles.card}>
            <h3>Expected Income</h3>
            <h2>GHS {summary.totalIncome}</h2>
            <p>Actual income against predicted income</p>

            <div className={styles.doughnutBox}>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={incomeChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                  ></Pie>
                  <Tooltip
                    formatter={(value, name) => [`GHS ${value}`, name]}
                    contentStyle={{
                      backgroundColor: "#312e81",
                      border: "none",
                      borderRadius: "10px",
                    }}
                    itemStyle={{
                      color: "#ffffff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.centerText}>
                <strong>{incomePercentage}%</strong>
                <span>Actual</span>
              </div>
            </div>

            <div className={styles.legend}>
              <div>
                <span className={styles.whiteDot}></span>
                Actual
              </div>

              <div>
                <span className={styles.blueDot}></span>
                Outstanding
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <h3>Total Expenses</h3>
            <h2>GHS ${summary.totalExpense}</h2>
            <p>Actual expenses against predicted expenses</p>

            <div className={styles.doughnutBox}>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                  ></Pie>
                  <Tooltip
                    formatter={(value, name) => [`GHS ${value}`, name]}
                    contentStyle={{
                      backgroundColor: "#312e81",
                      border: "none",
                      borderRadius: "10px",
                    }}
                    itemStyle={{
                      color: "#ffffff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.centerText}>
                <strong>{expensePercentage}%</strong>
                <span>Expense Incurred</span>
              </div>
            </div>
            <div className={styles.legend}>
              <div>
                <span className={styles.whiteDot}></span>
                Actual
              </div>

              <div>
                <span className={styles.blueDot}></span>
                Outstanding
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <h3>Account Balances</h3>

            {accounts.map((account) => (
              <div className={styles.accountItem} key={account.accountName}>
                <span>{account.accountName}</span>
                <strong>GHS {account.balance}</strong>
              </div>
            ))}
          </div>
        </div>

        {/*Row 2*/}
        <div className={styles.row2}>
          {/* <div className={styles.card}>
            <h3>Income vs Expenses Chart</h3>
            <div className={styles.chartPlaceholder}>line Chart goes here</div>
          </div> */}

          <div className={styles.card}>
            <h3>Income vs Expenses - 2026</h3>

            <div className={styles.lineChartBox}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyFinanceData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.2)"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#ffffff"
                    tick={{ fill: "#ffffff" }}
                  />

                  <YAxis stroke="#ffffff" tick={{ fill: "#ffffff" }} />

                  <Tooltip
                    formatter={(value, name) => [`GHS ${value}`, name]}
                    contentStyle={{
                      backgroundColor: "#312e81",
                      border: "none",
                      borderRadius: "10px",
                    }}
                    itemStyle={{
                      color: "#ffffff",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#ffffff"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#93c5fd"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
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
            <h3>Budget Items and Values</h3>

            <div className={styles.barChartBox}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.2)"
                  />

                  <XAxis
                    dataKey="item"
                    stroke="#ffffff"
                    tick={{ fill: "#ffffff" }}
                  />

                  <YAxis stroke="#ffffff" tick={{ fill: "#ffffff" }} />

                  <Tooltip
                    formatter={(value) => [`GHS ${value}`, "Budget"]}
                    contentStyle={{
                      backgroundColor: "#312e81",
                      border: "none",
                      borderRadius: "10px",
                    }}
                    itemStyle={{
                      color: "#ffffff",
                    }}
                  />

                  <Bar dataKey="value" fill="#93c5fd" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
