import { useState, useEffect } from "react";
import {
  getAllAccounts,
  createAccount,
  updateAccount,
} from "../../services/accountServices";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./Accounts.module.css";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    type: "",
    balance: "",
    paymentMethods: "",
    notes: "",
  });

  // ======================================
  // Fetch all accounts when page loads
  // ======================================

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const results = await getAllAccounts();
        console.log(results);
        const accountList = results.accounts || [];
        setAccounts(accountList);
      } catch (error) {
        console.log(error.response?.data || error.message);
        setError("Failed to load Accounts data");
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  // ======================================
  // Filter accounts based on search text
  // ======================================
  const filteredAccounts = Array.isArray(accounts)
    ? accounts.filter(
        (account) =>
          account.accountName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          account.accountNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          account.type?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // ======================================
  // Updates Create account form fields
  // ======================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ======================================
  // Creates a new accounts
  // ======================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const accountPreLoad = {
        ...formData,
        balance: Number(formData.balance),
      };
      const response = await createAccount(accountPreLoad);
      setSuccess(response.message || "Account successfully created.");

      const newAccount = response.account || response.data || response;

      setAccounts((prev) => [newAccount, ...prev]);

      setFormData({
        accountName: "",
        accountNumber: "",
        type: "",
        paymentMethods: "",
        notes: "",
      });
      setShowForm(false);
    } catch (error) {
      console.log(error.response?.data || error.message);
      setError(error.response?.data || "Failed to create new Account");
    }
  };
  // ======================================
  // Enables inline editing for a selected row
  // ======================================

  const handleEditClick = (account) => {
    setEditingId(account._id);
    setEditedRow(account);
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
  // Saves edited Account when input loses focus
  // ======================================
  const handleBlurSave = async () => {
    try {
      const payload = {
        ...editedRow,
        balance: Number(editedRow.balance),
      };
      const response = await updateAccount(editingId, payload);
      const updatedAccount = response.account || response.data || payload;

      // Update the edited account in the table
      setAccounts(
        (prev) =>
          prev.map((item) => (item._id === editingId ? updatedAccount : item))

        // Exit edit mode
      );
      setEditingId(null);
      setSuccess("Account updated successfully. ");
    } catch (error) {
      console.log(error.response?.data || error.message);
      setError("Failed to update Account record");
    }
  };
  // Display loading indicator while fetching Accounts
  if (loading) {
    return <p>Loading accounts...</p>;
  }

  return (
    // Main page container
    <div className={styles.AccountsPage}>
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={styles.AccountContent}>
        {/* Glassmorphism Card containing the Account module */}
        <div className={styles.AccountCard}>
          {/* Page Title */}
          <h1>Accounts</h1>

          {/* =========================
              Toolbar
              - Search Accounts
              - Show/Hide Create Account Form
          ========================== */}
          <div className={styles.toolbar}>
            <input
              type="text"
              placeholder="Search Accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />

            <button
              className={styles.addBtn}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Close Form" : "+ Add Account"}
            </button>
          </div>

          {/* Display Success and Error Messages */}
          {success && <p className={styles.successMessage}>{success}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}

          {/* =========================
              Create Account Form
              Displayed only when the
              Add Account button is clicked
          ========================== */}
          {showForm && (
            <div className={styles.formPanel}>
              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Account Name */}
                <div className={styles.formGroup}>
                  <label>Account Name</label>
                  <input
                    type="text"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    placeholder="Enter Account name"
                  />
                </div>
                {/* Account Number */}
                <div className={styles.formGroup}>
                  <label>Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Enter Account Number"
                  />
                </div>

                {/* Account Type */}
                <div className={styles.formGroup}>
                  <label>Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="">Select Account type</option>
                    <option value="bank">Bank</option>
                    <option value="cash">Cash</option>
                    <option value="momo">Momo</option>
                    <option value="investment">Investment</option>
                    <option value="savings">Savings</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                {/* Account Amount */}
                <div className={styles.formGroup}>
                  <label>Balance</label>
                  <input
                    type="number"
                    name="balance"
                    value={formData.balance}
                    onChange={handleChange}
                    placeholder="Enter balance"
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
                <button type="submit" className={styles.AccountBtn}>
                  Save
                </button>
              </form>
            </div>
          )}

          {/* =========================
              Editable Accounts Grid
          ========================== */}
          <div className={styles.gridWrapper}>
            <table className={styles.AccountGrid}>
              {/* Table Header */}
              <thead>
                <tr>
                  <th>Account Name</th>
                  <th>Account Number</th>
                  <th>Type</th>
                  <th>Balance</th>
                  <th>Notes</th>
                  <th>Edit</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {/* Display message if no Accounts exist */}
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className={styles.emptyText}>
                      No Accounts found
                    </td>
                  </tr>
                ) : (
                  /* Render each Account */
                  filteredAccounts.map((Account) => (
                    <tr key={Account._id}>
                      {/* Account Name */}
                      <td>
                        {editingId === Account._id ? (
                          <input
                            name="accountName"
                            value={editedRow.accountName || ""}
                            onChange={handleEditChange}
                            onBlur={handleBlurSave}
                            className={styles.gridInput}
                          />
                        ) : (
                          Account.accountName
                        )}
                      </td>

                      {/* Account Number */}
                      <td>
                        {editingId === Account._id ? (
                          <input
                            name="accountNumber"
                            value={editedRow.accountNumber || ""}
                            onChange={handleEditChange}
                            onBlur={handleBlurSave}
                            className={styles.gridInput}
                          />
                        ) : (
                          Account.accountNumber
                        )}
                      </td>

                      {/* Account Type */}
                      <td>
                        {editingId === Account._id ? (
                          <select
                            name="type"
                            value={editedRow.type || ""}
                            onChange={handleEditChange}
                            onBlur={handleBlurSave}
                            className={styles.gridInput}
                          >
                            <option value="">Select Account type</option>
                            <option value="bank">Bank</option>
                            <option value="cash">Cash</option>
                            <option value="momo">Momo</option>
                            <option value="investment">Investment</option>
                            <option value="savings">Savings</option>
                            <option value="emergency">Emergency</option>
                          </select>
                        ) : (
                          Account.type
                        )}
                      </td>

                      {/* Account Amount */}
                      <td>
                        {editingId === Account._id ? (
                          <input
                            type="number"
                            name="balance"
                            value={editedRow.balance || ""}
                            onChange={handleEditChange}
                            onBlur={handleBlurSave}
                            className={styles.gridInput}
                          />
                        ) : (
                          `GHS ${Account.balance}`
                        )}
                      </td>

                      {/* Account Notes */}
                      <td>
                        {editingId === Account._id ? (
                          <input
                            name="notes"
                            value={editedRow.notes || ""}
                            onChange={handleEditChange}
                            onBlur={handleBlurSave}
                            className={styles.gridInput}
                          />
                        ) : (
                          Account.notes || "-"
                        )}
                      </td>

                      {/* Enable Inline Editing */}
                      <td>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => handleEditClick(Account)}
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

export default Accounts;
