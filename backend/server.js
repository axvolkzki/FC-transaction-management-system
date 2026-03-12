const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");
const PDFDocument = require("pdfkit");
const { v4: uuidv4 } = require("uuid");
const { time, timeStamp } = require("console");

const app = express();
const PORT = 3001;
const CSV_FILE = path.join(__dirname, "transactions.csv");

app.use(cors());
app.use(express.json());

// --- CSV Helpers ---
const CSV_HEADERS = ["Transaction Date", "Account Number", "Account Holder Name", "Amount", "Status"];

// Reads transactions from the CSV file, ensuring it exists and has valid content
function readTransactions() {
  // If the CSV file doesn't exist, create it with headers and return an empty array
  if (!fs.existsSync(CSV_FILE)) {
    fs.writeFileSync(CSV_FILE, CSV_HEADERS.join(",") + "\n");
    return [];
  }

  const content = fs.readFileSync(CSV_FILE, "utf-8");
  if (!content.trim() || content.trim() === CSV_HEADERS.join(",")) return [];

  try {
    const records = parse(content, { columns: true, skip_empty_lines: true, trim: true });
    return records.map((r) => ({ ...r, Amount: parseFloat(r.Amount).toFixed(2) }));     // Ensure Amount is a number with 2 decimal places
  } catch {
    console.error("Error parsing CSV content. Returning empty transactions list.");
    return [];
  }
}


// --- Routes ---

// GET /transactions - list all transactions with optional filters
app.get("/transactions", (req, res) => {
  let transactions = readTransactions();

  res.json(transactions);
});

// GET /health - simple endpoint to check if the server is running
app.get("/health", (req, res) => {
  res.json({ status: "ok", timeStamp: new Date().toISOString() });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});