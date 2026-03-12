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
const CSV_HEADERS = ["transaction_date", "account_number", "account_holder_name", "amount", "status"];

// --- Routes ---

// GET /health - simple endpoint to check if the server is running
app.get("/health", (req, res) => {
  res.json({ status: "ok", timeStamp: new Date().toISOString() });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});