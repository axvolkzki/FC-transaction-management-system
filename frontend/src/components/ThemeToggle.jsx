import "./ThemeToggle.css";

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <div className="theme-toggle" onClick={onToggle} title="Toggle theme">
      <div className={`toggle-track ${theme === "light" ? "light" : ""}`}>
        <span className="toggle-icon">🌙</span>
        <span className="toggle-icon">☀️</span>
        <div className="toggle-thumb" />
      </div>
    </div>
  );
}