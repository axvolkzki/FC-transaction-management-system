import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_FILE = path.join(__dirname, "transactions.csv");
const CSV_HEADERS = ["id", "Transaction Date", "Account Number", "Account Holder Name", "Amount", "Status"];

// Check if file exists first
if (!fs.existsSync(CSV_FILE)) {
  alert(`File not found: ${CSV_FILE}. Run 'npm rrun setup' first to create the file.`);
  process.exit(1);
}

const content = fs.readFileSync(CSV_FILE, "utf-8");
const records = parse(content, { columns: true, skip_empty_lines: true, trim: true });

let migrated = 0;

const migratedTransactions = records.map((r) => {
  const hasId = r.id && r.id.trim() !== "";
  if (!hasId) migrated++;

  return {
    id: hasId ? r.id : crypto.randomUUID(), // ← crypto instead of uuid
    "Transaction Date": r["Transaction Date"],
    "Account Number": r["Account Number"],
    "Account Holder Name": r["Account Holder Name"],
    "Amount": parseFloat(r["Amount"] || r.Amount || 0).toFixed(2),
    "Status": r["Status"],
  };
});

fs.writeFileSync(
  CSV_FILE,
  stringify(migratedTransactions, { header: true, columns: CSV_HEADERS })
);

console.log(`Migration completed.`);
console.log(`Total records : ${migratedTransactions.length}`);
console.log(`IDs generated : ${migrated}`);
console.log(`Already had ID: ${migratedTransactions.length - migrated}`);