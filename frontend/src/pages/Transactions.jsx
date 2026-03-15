import { use, useEffect, useState } from "react";
import { api } from "../api";
import "./Transactions.css";

const STATUS = ["pending", "settled", "failed"];
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const emptyForm = { transaction_date: "", account_number: "", account_holder_name: "", amount: "", status: "" };

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ status: "", search: "" });

  const getTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
      );
      const res = await api.get(`/transactions?${params}`);
      setTransactions(res);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactions();
  }, [filters]);

  const handleSubmit = async () => {
    setError("");
    // All fields are required
    if (!form.transaction_date || !form.account_number || !form.account_holder_name || !form.amount || !form.status) { setError("All fields are required."); return; }
    
    // Validate amount
    if (isNaN(form.amount) || parseFloat(form.amount) <= 0) { setError("Amount must be a positive number."); return; }

    // Validate status
    if (!STATUS.includes(form.status)) { setError("Invalid status."); return; }

    // Validate account number (basic check for format)
    if (!/^\d{4}-\d{4}-\d{4}$/.test(form.account_number)) { setError("Account number must be in the format XXXX-XXXX-XXXX."); return; }

    await api.post("/transactions", form);
    
    setForm(emptyForm);
    setShowForm(false);
    getTransactions();
  };


  return (
    <div className="transactions-page">
      <div className="txn-header">
        <div>
          <h1>Transactions</h1>
          <p className="subtitle">{transactions.length} records</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(true); setForm(emptyForm); setError(""); }}>
          + Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          className="filter-input"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        />
        <select className="filter-select" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          <option value="">All Statuses</option>
          <option value="settled">Settled</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        {(filters.status || filters.search) && (
          <button className="clear-btn" onClick={() => setFilters({ status: "", search: "" })}>Clear</button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <p>No transactions found.</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>Add your first transaction</button>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="txn-table">
            <thead>
              <tr><th>Transaction Date</th><th>Account Number</th><th>Account Holder Name</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="mono">{t.transaction_date}</td>
                  <td>{t.account_number}</td>
                  <td>{t.account_holder_name}</td>
                  <td className={t.amount >= 0 ? "positive" : "negative"}>{fmt(t.amount)}</td>
                  <td className={`badge badge-${t.status}`}>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{"New Transaction"}</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            {error && <div className="form-error">{error}</div>}
            <div className="form-grid">
              {/* Setting max to today to prevent future dates */}
              <label>Transaction Date
                <input type="date" max={new Date().toISOString().split("T")[0]} value={form.transaction_date} onChange={(e) => setForm((f) => ({ ...f, transaction_date: e.target.value }))} />
              </label>
              <label>Account Number
                <input value={form.account_number} onChange={(e) => setForm((f) => ({ ...f, account_number: e.target.value }))} placeholder="e.g. 1234-5678-9010" />
              </label>
              <label>Account Holder Name
                <input value={form.account_holder_name} onChange={(e) => setForm((f) => ({ ...f, account_holder_name: e.target.value }))} placeholder="e.g. John Doe" />
              </label>
              <label>Amount ($)
                <input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
              </label>
              <label>Status
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                  <option value="" disabled>Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="settled">Settled</option>
                  <option value="failed">Failed</option>
                </select>
              </label>
            </div>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSubmit}>Add Transaction</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
