import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import PDFDocument from "pdfkit";
import { validateTransaction } from "@transaction/shared";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 3001;
const CSV_FILE = path.join(__dirname, "transactions.csv");

app.use(cors());
app.use(express.json());

// --- CSV Helpers ---
const CSV_HEADERS = ["id", "Transaction Date", "Account Number", "Account Holder Name", "Amount", "Status"];

// Reads transactions from the CSV file, ensuring it exists and has valid content (for writing back to the file)
function readRawTransactions() {
  // If the CSV file doesn't exist, create it with headers and return an empty array
  if (!fs.existsSync(CSV_FILE)) {
    fs.writeFileSync(CSV_FILE, CSV_HEADERS.join(",") + "\n");
    return [];
  }

  const content = fs.readFileSync(CSV_FILE, "utf-8");
  if (!content.trim() || content.trim() === CSV_HEADERS.join(",")) return [];

  return parse(content, { columns: true, skip_empty_lines: true, trim: true });
}

// Reads transactions and maps them to a more convenient format for the API (for frontend consumption)
function readTransactions() {
  return readRawTransactions().map((t) => ({
    id: t.id,
    transaction_date: t["Transaction Date"],
    account_number: t["Account Number"],
    account_holder_name: t["Account Holder Name"],
    amount: parseFloat(t["Amount"]),
    status: t["Status"]
  }));
}

// Writes the given transactions array back to the CSV file
function writeTransactions(transactions) {
  const csv = stringify(transactions, { header: true, columns: CSV_HEADERS });
  fs.writeFileSync(CSV_FILE, csv);
}

// --- Routes ---

// GET /transactions - list all transactions with optional filters
app.get("/transactions", (req, res) => {
  let transactions = readTransactions();

    const { status, from, to, search } = req.query;

    if (status) {
        transactions = transactions.filter((t) => t.status.toLowerCase() === status.toLowerCase());
    }

    if (from) {
        transactions = transactions.filter((t) => new Date(t["Transaction Date"]) >= new Date(from));
    }

    if (to) {
        transactions = transactions.filter((t) => new Date(t["Transaction Date"]) <= new Date(to));
    }

    if (search) {
        const q = search.toLowerCase();
        transactions = transactions.filter(
            (t) => t["Account Holder Name"].toLowerCase().includes(q) || t["Account Number"].toLowerCase().includes(q)
        );
    }

  res.json(transactions);
});

// POST /transactions - add a new transaction
app.post("/transactions", (req, res) => {
  const { transaction_date, account_number, account_holder_name, amount, status } = req.body;
  
  if (!transaction_date || !account_number || !account_holder_name || !amount || !status) {
    return res.status(400).json({ error: "All fields are required: Transaction Date, Account Number, Account Holder Name, Amount, Status" });
  }

  if (!["Pending", "Settled", "Failed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status. Must be one of: Pending, Settled, Failed" });
  }

  const newTransaction = {
    "id": uuidv4(), // Generate a unique ID for the transaction
    "Transaction Date": transaction_date,
    "Account Number": account_number,
    "Account Holder Name": account_holder_name,
    "Amount": parseFloat(amount).toFixed(2),
    "Status": status
  };

  const transactions = readRawTransactions();
  transactions.push(newTransaction);
  writeTransactions(transactions);

  res.status(201).json({ timeStamp: new Date().toISOString(), ...newTransaction });
});

// GET /health - simple endpoint to check if the server is running
app.get("/health", (req, res) => {
  res.json({ status: "ok", timeStamp: new Date().toISOString() });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});