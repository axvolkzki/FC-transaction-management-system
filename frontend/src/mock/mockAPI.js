import Papa from "papaparse";
import sampleCsv from "./sample.csv?raw";

// Parse CSV once
const raw = Papa.parse(sampleCsv, { header: true, skipEmptyLines: true });

const transactions = raw.data.map((r) => ({
  id: r.id,
  transaction_date: r["Transaction Date"] || r.transaction_date,
  account_number: r["Account Number"] || r.account_number,
  account_holder_name: r["Account Holder Name"] || r.account_holder_name,
  amount: parseFloat(r["Amount"] || r.amount),
  status: r["Status"] || r.status,
}));

// Mimic api.js interface
export const mockAPI = {
  get: (path) => {
    const url = new URL(path, "http://localhost");
    const params = url.searchParams;

    let results = [...transactions];

    // Apply filters
    const status = params.get("status");
    const search = params.get("search");
    const from = params.get("from");
    const to = params.get("to");

    if (status) results = results.filter((t) => t.status === status);
    if (search) results = results.filter((t) =>
      t.account_holder_name.toLowerCase().includes(search.toLowerCase()) ||
      t.account_number.includes(search)
    );
    if (from) results = results.filter((t) => new Date(t.transaction_date) >= new Date(from));
    if (to)   results = results.filter((t) => new Date(t.transaction_date) <= new Date(to));

    return Promise.resolve(results);
  },

  post: (path, body) => {
    const newTxn = { ...body, id: crypto.randomUUID() };
    transactions.push(newTxn);
    return Promise.resolve(newTxn);
  },
};