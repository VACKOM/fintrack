import { useState, useEffect } from "react";
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
} from "../../services/transactionService";
import styles from "./Transactions.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    amount: "",
    category: "",
    paymentMethod: "",
    notes: "",
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getAllTransactions();

        const transactionList = data.transactions || data.data || [];

        setTransactions(transactionList);
      } catch (error) {
        console.log(error.response?.data || error.message);
        setError("Failed to load transactions record");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = Array.isArray(transactions)
    ? transactions.filter(
        (transaction) =>
          transaction.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.category
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.type?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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

      setSuccess(response.message || "Transaction successfully created");

      const newTransaction = response.transaction || response.data || response;

      setTransactions((prev) => [newTransaction, ...prev]);

      setFormData({
        name: "",
        type: "",
        amount: "",
        category: "",
        paymentMethod: "",
        notes: "",
      });

      setShowForm(false);
    } catch (error) {
      console.log(error.response?.data || error.message);
      setError(error.response?.data?.message || "Transaction creation failed");
    }
  };

  const handleEditClick = (transaction) => {
    setEditingId(transaction._id);
    setEditedRow(transaction);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditedRow({
      ...editedRow,
      [name]: value,
    });
  };

  const handleBlurSave = async () => {
    try {
      const payload = {
        ...editedRow,
        amount: Number(editedRow.amount),
      };

      const response = await updateTransaction(editingId, payload);

      const updatedTransaction =
        response.transaction || response.data || payload;

      setTransactions((prev) =>
        prev.map((item) => (item._id === editingId ? updatedTransaction : item))
      );

      setEditingId(null);
      setSuccess("Transaction updated successfully");
    } catch (error) {
      console.log(error.response?.data || error.message);
      setError("Failed to update transaction");
    }
  };

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div className={styles.transactionsPage}>
      <Sidebar />

      <div className={styles.transactionContent}>
        <div className={styles.transactionCard}>
          <h1>Transactions</h1>

          <div className={styles.toolbar}>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />

            <button
              className={styles.addBtn}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Close Form" : "+ Add Transaction"}
            </button>
          </div>

          {success && <p className={styles.successMessage}>{success}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}

          {showForm && (
            <div className={styles.formPanel}>
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
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
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
                    <option value="">Select payment method</option>
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
          )}

          <div className={styles.gridWrapper}>
            <table className={styles.transactionGrid}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th>Notes</th>
                  <th>Edit</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className={styles.emptyText}>
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>
                        {editingId === transaction._id ? (
                          <input
                            name="name"
                            value={editedRow.name || ""}
                            onChange={handleEditChange}
                            onBlur={handleBlurSave}
                            className={styles.gridInput}
                          />
                        ) : (
                          transaction.name
                        )}
                      </td>

                      <td>
                        {editingId === transaction._id ? (
                          <select
                            name="type"
                            value={editedRow.type || ""}
                            onChange={handleEditChange}
                            onBlur={handleBlurSave}
                            className={styles.gridInput}
                          >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                          </select>
                        ) : (
                          transaction.type
                        )}
                      </td>

                      <td>
                        {editingId === transaction._id ? (
                          <input
                            name="category"
                            value={editedRow.category || ""}
                            onChange={handleEditChange}
                            onBlur={handleBlurSave}
                            className={styles.gridInput}
                          />
                        ) : (
                          transaction.category
                        )}
                      </td>

                      <td>
                        {editingId === transaction._id ? (
                          <select
                            name="paymentMethod"
                            value={editedRow.paymentMethod || ""}
                            onChange={handleEditChange}
                            onBlur={handleBlurSave}
                            className={styles.gridInput}
                          >
                            <option value="bank">Bank</option>
                            <option value="momo">Momo</option>
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                            <option value="others">Others</option>
                          </select>
                        ) : (
                          transaction.paymentMethod
                        )}
                      </td>

                      <td>
                        {editingId === transaction._id ? (
                          <input
                            type="number"
                            name="amount"
                            value={editedRow.amount || ""}
                            onChange={handleEditChange}
                            onBlur={handleBlurSave}
                            className={styles.gridInput}
                          />
                        ) : (
                          `GHS ${transaction.amount}`
                        )}
                      </td>

                      <td>
                        {editingId === transaction._id ? (
                          <input
                            name="notes"
                            value={editedRow.notes || ""}
                            onChange={handleEditChange}
                            onBlur={handleBlurSave}
                            className={styles.gridInput}
                          />
                        ) : (
                          transaction.notes || "-"
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => handleEditClick(transaction)}
                        >
                          ✓
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
