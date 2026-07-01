import { useState, useEffect } from "react";
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
} from "../../services/transactionService";
import styles from "./Transactions.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";

const Transaction = () => {
  // ==============================
  // State Management
  // ==============================

  // Stores all transactions retrieved from the backend
  const [transactions, setTransactions] = useState([]);

  // Stores the text entered into the search box
  const [searchTerm, setSearchTerm] = useState("");

  // Controls whether the Create Transaction form is displayed
  const [showForm, setShowForm] = useState(false);

  // Stores the id of the transaction currently being edited
  const [editingId, setEditingId] = useState(null);

  // Stores the values of the transaction currently being edited
  const [editedRow, setEditedRow] = useState({});

  // Displays error and success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Indicates whether data is still loading
  const [loading, setLoading] = useState(true);

  // Holds the Create Transaction form values
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    amount: "",
    category: "",
    paymentMethod: "",
    notes: "",
  });

  // ======================================
  // Fetch all transactions when page loads
  // ======================================
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

  // ======================================
  // Filter transactions based on search text
  // ======================================
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

  // ======================================
  // Updates Create Transaction form fields
  // ======================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ======================================
  // Creates a new transaction
  // ======================================
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

      // Add newly created transaction to the top of the grid
      setTransactions((prev) => [newTransaction, ...prev]);

      // Clear the form after successful submission
      setFormData({
        name: "",
        type: "",
        amount: "",
        category: "",
        paymentMethod: "",
        notes: "",
      });

      // Close the form
      setShowForm(false);
    } catch (error) {
      console.log(error.response?.data || error.message);
      setError(error.response?.data?.message || "Transaction creation failed");
    }
  };

  // ======================================
  // Enables inline editing for a selected row
  // ======================================
  const handleEditClick = (transaction) => {
    setEditingId(transaction._id);
    setEditedRow(transaction);
  };

  // ======================================
  // Updates values while editing a row
  // ======================================
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditedRow({
      ...editedRow,
      [name]: value,
    });
  };

  // ======================================
  // Saves edited transaction when input loses focus
  // ======================================
  const handleBlurSave = async () => {
    try {
      const payload = {
        ...editedRow,
        amount: Number(editedRow.amount),
      };

      const response = await updateTransaction(editingId, payload);

      const updatedTransaction =
        response.transaction || response.data || payload;

      // Update the edited transaction in the table
      setTransactions((prev) =>
        prev.map((item) => (item._id === editingId ? updatedTransaction : item))
      );

      // Exit edit mode
      setEditingId(null);

      setSuccess("Transaction updated successfully");
    } catch (error) {
      console.log(error.response?.data || error.message);
      setError("Failed to update transaction");
    }
  };

  // Display loading indicator while fetching transactions
  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    // Main page container
    <div className={styles.transactionsPage}>
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={styles.transactionContent}>
        {/* Glassmorphism Card containing the transaction module */}
        <div className={styles.transactionCard}>
          {/* Page Title */}
          <h1>Transactions</h1>

          {/* =========================
              Toolbar
              - Search transactions
              - Show/Hide Create Transaction Form
          ========================== */}
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

          {/* Display Success and Error Messages */}
          {success && <p className={styles.successMessage}>{success}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}

          {/* =========================
              Create Transaction Form
              Displayed only when the
              Add Transaction button is clicked
          ========================== */}
          {showForm && (
            <div className={styles.formPanel}>
              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Transaction Name */}
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

                {/* Transaction Type */}
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

                {/* Transaction Amount */}
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

                {/* Transaction Category */}
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

                {/* Payment Method */}
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

                {/* Optional Notes */}
                <div className={styles.formGroup}>
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Enter notes"
                  />
                </div>

                {/* Submit Button */}
                <button type="submit" className={styles.transactionBtn}>
                  Save
                </button>
              </form>
            </div>
          )}

          {/* =========================
              Editable Transactions Grid
          ========================== */}
          <div className={styles.gridWrapper}>
            <table className={styles.transactionGrid}>
              {/* Table Header */}
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

              {/* Table Body */}
              <tbody>
                {/* Display message if no transactions exist */}
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className={styles.emptyText}>
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  /* Render each transaction */
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction._id}>
                      {/* Transaction Name */}
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

                      {/* Transaction Type */}
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

                      {/* Category */}
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

                      {/* Payment Method */}
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

                      {/* Transaction Amount */}
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

                      {/* Transaction Notes */}
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

                      {/* Enable Inline Editing */}
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
