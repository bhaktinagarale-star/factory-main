const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");

// Load Google Sheets credentials
const credentials = JSON.parse(fs.readFileSync("credentials/credentials.json"));
const { client_email, private_key } = credentials;
const scopes = ["https://www.googleapis.com/auth/spreadsheets"];

// Initialize JWT authorization for Google API
const auth = new google.auth.JWT(client_email, null, private_key, scopes);
const sheets = google.sheets({ version: "v4", auth });

// Define your Google Spreadsheet ID
const spreadsheetId = "1S1YyDtB4MwT7b26w5jN4rjyRvlW0vbAJoKD5D0nRQnI";

// Initialize Express app
const app = express();
app.use(express.json()); // Parse incoming JSON data
app.use(express.static("public")); // Serve static files (HTML, CSS, JS) from public folder

// Use routes for API (employee CRUD operations)
app.use("/api", require("./routes/api"));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
