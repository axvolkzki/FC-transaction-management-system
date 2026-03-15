import { useEffect, useState } from "react";
// import {
//   Chart as ChartJS, CategoryScale, LinearScale, BarElement,
//   ArcElement, Tooltip, Legend, LineElement, PointElement,
// } from "chart.js";
// import { Bar, Doughnut } from "react-chartjs-2";
import { api } from "../api";
import "./Dashboard.css";

// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, LineElement, PointElement);

// const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Your financial overview</p>
      </div>
    </div>
  );
}
 