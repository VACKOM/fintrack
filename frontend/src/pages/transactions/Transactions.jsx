import { useState } from "react";
import { createTransaction } from "../../services/transactionService";
import styles from "./Transactions.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";

const Transactions = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    amount: "",
    category: "",
    paymentMethod: "",
    notes: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const transactionPayload = {
        ...formData,
        amount: Number(formData.amount),
      };

      const response = await createTransaction(transactionPayload);

      console.log(response);
      setSuccess(response.message || "Transaction successfully created");

      setFormData({
        name: "",
        type: "",
        amount: "",
        category: "",
        paymentMethod: "",
        notes: "",
      });
    } catch (error) {
      console.log(error.response?.data);
      setError(error.response?.data?.message || "Transaction creation failed");
    }
  };

  return (
    <div className={styles.transactionPage}>
      <Sidebar />

      <main className={styles.transactionContent}>
        <div className={styles.transactionCard}>
          <h1>Create Transaction</h1>
          {success && <p className={styles.successMessage}>{success}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter transaction name"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="">Select transaction type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter transaction category"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="">Select Payment Method</option>
                <option value="bank">Bank</option>
                <option value="momo">Momo</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter notes"
              />
            </div>

            <button type="submit" className={styles.transactionBtn}>
              Save
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Transactions;
