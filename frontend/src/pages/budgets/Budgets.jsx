import { useState, useEffect } from "react";
import {
  createBudget,
  getAllBudgets,
  updateBudget,
} from "../../services/budgetServices";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./Budgets.module.css";

const Budgets = () => {
  const [budget, setBudget] = useState([]);
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    budgetName: "",
    category: "",
    frequency: "",
    amount: 0,
    paymentMethod: "",
    recipient: "",
    dueDate: "",
    notes: "",
  });

  // ======================================
  // Fetch all budget when page loads
  // ======================================

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const results = await getAllBudgets();
        const budgetList = results.budgets || [];
        setBudget(budgetList);
        console.log(results);
      } catch (error) {
        console.log(error.message || error.response?.data);
        setError("Budget Loading Failed");
      } finally {
        setLoading(false);
      }
    };
    fetchBudget();
  }, []);

  // ======================================
  // Filter budget based on search text
  // ======================================

  const filteredBudgets = Array.isArray(budget)
    ? budget.filter(
        (budget) =>
          budget.budgetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          budget.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          budget.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // ======================================
  // Updates Create budget form fields
  // ======================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // ======================================
  // Creates a new Budgets
  // ======================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const budgetPreload = {
        ...formData,
        amount: Number(formData.amount),
      };
      const response = await createBudget(budgetPreload);
      setSuccess(response.message || "Budget successfully created");
      const newBudget = response.budget || response.data || response;
      setBudget((prev) => [newBudget, ...prev]);
      setFormData({
        budgetName: "",
        category: "",
        frequency: "",
        amount: 0,
        paymentMethod: "",
        recipient: "",
        dueDate: "",
        notes: "",
      });
      setShowForm(false);
    } catch (error) {
      console.log(error.response?.data || error.message);
      setError(error.response?.data || "Failed to create a new Budget");
    }
  };

  // ======================================
  // Enables inline editing for a selected row
  // ======================================

  const handleEditClick = (budget) => {
    setEditingId(budget._id);
    setEditedRow({
      ...budget,
      dueDate: budget.dueDate ? budget.dueDate.substring(0, 10) : "",
    });
  };

  // ======================================
  // Updates values while editing a row
  // ======================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditedRow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================
  // Saves edited Budget when input loses focus
  // ======================================

  const handleBlurSave = async (updatedRow = editedRow) => {
    try {
      const payload = {
        ...updatedRow,
        amount: Number(updatedRow.amount),
      };
      const response = await updateBudget(editingId, payload);
      const updatedBudget = response.budget || response.data || payload;

      // Update the edited Budget in the table
      setBudget(
        (prev) =>
          prev.map((item) => (item._id === editingId ? updatedBudget : item))

        // Exit edit mode
      );
      setEditingId(null);
      setSuccess("Budget updated successfully. ");
    } catch (error) {
      console.log(error.response?.data || error.message);
      setError("Failed to update Budget record");
    }
  };
  // Display loading indicator while fetching Budgets
  if (loading) {
    return <p>Loading budgets...</p>;
  }

  return (
    // Main page container
    <div className={styles.BudgetsPage}>
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={styles.BudgetContent}>
        {/* Glassmorphism Card containing the Budget module */}
        <div className={styles.BudgetCard}>
          {/* Page Title */}
          <h1>Budgets</h1>

          {/* =========================
              Toolbar
              - Search Budgets
              - Show/Hide Create Budget Form
          ========================== */}
          <div className={styles.toolbar}>
            <input
              type="text"
              placeholder="Search Budgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />

            <button
              className={styles.addBtn}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Close Form" : "+ Add Budget"}
            </button>
          </div>

          {/* Display Success and Error Messages */}
          {success && <p className={styles.successMessage}>{success}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}

          {/* =========================
              Create Budget Form
              Displayed only when the
              Add Budget button is clicked
          ========================== */}
          {showForm && (
            <div className={styles.formPanel}>
              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Budget Name */}
                <div className={styles.formGroup}>
                  <label>Budget Name</label>
                  <input
                    type="text"
                    name="budgetName"
                    value={formData.budgetName}
                    onChange={handleChange}
                    placeholder="Enter Budget name"
                  />
                </div>
                {/* Budget Number */}
                <div className={styles.formGroup}>
                  <label>Budget Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Budget Category</option>
                    <option value="Food & Groceries">Food & Groceries</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Internet">Internet</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Transportation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Travel">Travel</option>
                    <option value="Savings">Savings</option>
                    <option value="Investments">Investments</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Loan Repayment">Loan Repayment</option>
                    <option value="Child Care">Child Care</option>
                    <option value="Household">Household</option>
                    <option value="Beauty & Cosmetics">
                      Beauty & Cosmetics
                    </option>
                    <option value="Tithe">Tithe</option>
                    <option value="Offering">Offering</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>

                {/* Budget Type */}
                <div className={styles.formGroup}>
                  <label>Frequency</label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                  >
                    <option value="">Select Budget type</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                    <option value="one - time">One - Time</option>
                  </select>
                </div>

                {/* Budget Amount */}
                <div className={styles.formGroup}>
                  <label>amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                  />
                </div>
                {/* Account Type */}
                <div className={styles.formGroup}>
                  <label>Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="">Select Payment Method</option>
                    <option value="bank">Bank</option>
                    <option value="cash">Cash</option>
                    <option value="momo">Momo</option>
                    <option value="card">Card</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                {/* Optional due date */}
                <div className={styles.formGroup}>
                  <label>Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    placeholder="Enter Due Date"
                  />
                </div>

                {/* Optional recipient */}
                <div className={styles.formGroup}>
                  <label>Recipient</label>
                  <input
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    placeholder="Enter recipient"
                  />
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
                <button type="submit" className={styles.BudgetBtn}>
                  Save
                </button>
              </form>
            </div>
          )}

          {/* =========================
              Editable Budgets Grid
          ========================== */}
          <div className={styles.gridWrapper}>
            <table className={styles.BudgetGrid}>
              {/* Table Header */}
              <thead>
                <tr>
                  <th>Budget Name</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Frequency</th>
                  <th>Recipient</th>
                  <th>Due Date</th>
                  <th>Notes</th>
                  <th>Edit</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {/* Display message if no Budgets exist */}
                {filteredBudgets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className={styles.emptyText}>
                      No Budgets found
                    </td>
                  </tr>
                ) : (
                  /* Render each Budget */
                  filteredBudgets.map((budget) => (
                    <tr key={budget._id}>
                      {/* Budget Name */}
                      <td>
                        {editingId === budget._id ? (
                          <input
                            name="budgetName"
                            value={editedRow.budgetName || ""}
                            onChange={handleEditChange}
                            onBlur={() => handleBlurSave()}
                            className={styles.gridInput}
                          />
                        ) : (
                          budget.budgetName
                        )}
                      </td>

                      {/* Budget Number */}
                      <td>
                        {editingId === budget._id ? (
                          <input
                            name="category"
                            value={editedRow.category || ""}
                            onChange={handleEditChange}
                            onBlur={() => handleBlurSave()}
                            className={styles.gridInput}
                          />
                        ) : (
                          budget.category
                        )}
                      </td>

                      {/* Budget Amount */}
                      <td>
                        {editingId === budget._id ? (
                          <input
                            type="number"
                            name="amount"
                            value={editedRow.amount || ""}
                            onChange={handleEditChange}
                            onBlur={() => handleBlurSave()}
                            className={styles.gridInput}
                          />
                        ) : (
                          `GHS ${budget.amount}`
                        )}
                      </td>

                      {/* Budget payment Method */}
                      <td>
                        {editingId === budget._id ? (
                          <select
                            name="paymentMethod"
                            value={editedRow.paymentMethod || ""}
                            onChange={handleEditChange}
                            onBlur={() => handleBlurSave()}
                            className={styles.gridInput}
                          >
                            <option value="">
                              Select Budget Payment Method
                            </option>
                            <option value="bank">Bank</option>
                            <option value="cash">Cash</option>
                            <option value="momo">Momo</option>
                            <option value="card">Card</option>
                            <option value="others">Others</option>
                          </select>
                        ) : (
                          budget.paymentMethod
                        )}
                      </td>

                      <td>
                        {editingId === budget._id ? (
                          <select
                            name="frequency"
                            value={editedRow.frequency || ""}
                            onChange={handleEditChange}
                            onBlur={() => handleBlurSave()}
                            className={styles.gridInput}
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                            <option value="one-time">One-Time</option>
                          </select>
                        ) : (
                          budget.frequency
                        )}
                      </td>

                      <td>
                        {editingId === budget._id ? (
                          <input
                            name="recipient"
                            value={editedRow.recipient || ""}
                            onChange={handleEditChange}
                            onBlur={() => handleBlurSave()}
                            className={styles.gridInput}
                          />
                        ) : (
                          budget.recipient || "-"
                        )}
                      </td>

                      <td>
                        {editingId === budget._id ? (
                          <input
                            type="date"
                            name="dueDate"
                            value={editedRow.dueDate || ""}
                            onChange={handleEditChange}
                            onBlur={() => handleBlurSave()}
                            className={styles.gridInput}
                          />
                        ) : (
                          budget.dueDate?.substring(0, 10)
                        )}
                      </td>

                      {/* Budget Notes */}
                      <td>
                        {editingId === budget._id ? (
                          <input
                            name="notes"
                            value={editedRow.notes || ""}
                            onChange={handleEditChange}
                            onBlur={() => handleBlurSave()}
                            className={styles.gridInput}
                          />
                        ) : (
                          budget.notes || "-"
                        )}
                      </td>

                      {/* Enable Inline Editing */}
                      <td>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() =>
                            editingId === budget._id
                              ? handleBlurSave()
                              : handleEditClick(budget)
                          }
                        >
                          {editingId === budget._id ? "Save" : "✓"}
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

export default Budgets;
