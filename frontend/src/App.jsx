import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import Dashboard from "./pages/dashboards/Dashboard";
import Transactions from "./pages/transactions/Transactions";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
