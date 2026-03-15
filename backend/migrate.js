const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");
const { v4: uuidv4 } = require("uuid");

const CSV_FILE = path.join(__dirname, "transactions.csv");

// --- CSV Helpers ---
const CSV_HEADERS = ["Transaction Date", "Account Number", "Account Holder Name", "Amount", "Status"];

const content = fs.readFileSync(CSV_FILE, "utf-8");
const records = parse(content, { columns: true, skip_empty_lines: true, trim: true });

const migratedTransactions = records.map((r) => ({ 
  ...r, 
  Amount: parseFloat(r.Amount).toFixed(2),          // Ensure amount is a string with 2 decimal places
  id: r.id && r.id.trim() !== "" ? r.id : uuidv4() // Generate a unique ID if not present
}));

fs.writeFileSync(CSV_FILE, stringify(migratedTransactions, { header: true, columns: ["id", ...CSV_HEADERS] })); // Add 'id' to headers
console.log(`Migration completed. Migrated ${migratedTransactions.length} transactions with unique IDs.`);