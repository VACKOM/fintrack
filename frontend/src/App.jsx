import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import Dashboard from "./pages/dashboards/Dashboard";
import Transactions from "./pages/transactions/Transactions";
import Accounts from "./pages/accounts/Accounts";
import Budgets from "./pages/budgets/Budgets";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/budgets" element={<Budgets />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
