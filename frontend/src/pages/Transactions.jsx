import { useEffect, useState } from "react";
import { api } from "../api";
import "./Transactions.css";

const STATUS = ["Pending", "Settled", "Failed"];
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const emptyForm = { transaction_date: "", account_number: "", account_holder_name: "", amount: "", status: "Pending" };

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ status: "", search: "" });

  const fetchTxns = () => {
    const params = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)));
    setLoading(true);
    api.get(`/transactions?${params}`).then((data) => {
      setTransactions(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchTxns(); }, [filters]);

  const handleSubmit = async () => {
    setError("");
    if (!form.account_holder_name || !form.amount) { setError("Account holder name and amount are required."); return; }
    if (isNaN(form.amount) || parseFloat(form.amount) <= 0) { setError("Amount must be a positive number."); return; }

    await api.post("/transactions", form);
    
    setForm(emptyForm);
    setShowForm(false);
    fetchTxns();
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
          <option value="completed">Completed</option>
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
                  <td className={`status-${t.status}`}>{t.status}</td>
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
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
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
