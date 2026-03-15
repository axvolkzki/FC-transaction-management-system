import { Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import { api } from "./api";
import "./App.css";
import { useTheme } from "./hooks/useTheme";
import ThemeToggle from "./components/ThemeToggle";


export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-mark">T</span>
          <span>Transaction MS</span>
        </div>
        <nav className="nav">
          {/* <NavLink to="/" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </NavLink> */}
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            Transactions
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <span className="export-label">Appearance</span>
          <div className="theme-row">
            <span style={{ fontSize: 13, color: "var(--muted)" }}>
              {theme === "dark" ? "Dark mode" : "Light mode"}
            </span>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>
      </aside>
      <main className="main-content">
        <Routes>
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/" element={<Transactions />} />
        </Routes>
      </main>
    </div>
  );
}
