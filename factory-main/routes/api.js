const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const fs = require("fs");

// Load Google Sheets credentials
const credentials = JSON.parse(fs.readFileSync("credentials/credentials.json"));
const { client_email, private_key } = credentials;
const scopes = ["https://www.googleapis.com/auth/spreadsheets"];

const auth = new google.auth.JWT(client_email, null, private_key, scopes);
const sheets = google.sheets({ version: "v4", auth });

const spreadsheetId = "1S1YyDtB4MwT7b26w5jN4rjyRvlW0vbAJoKD5D0nRQnI";

// GET all employees from the Google Sheet
router.get("/employees", async (req, res) => {
  try {
    const range = "Sheet1!A2:F"; // Adjust range if needed
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    res.json(rows);
  } catch (err) {
    res.status(500).send("Error fetching employees data from Google Sheets");
  }
});

//GET all departments from the Goole Sheet
router.get("/departments", async (req, res) => {
  try {
    const range = "Sheet2!A2:B";
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    res.json(rows);
  } catch (err) {
    res.status(500).send("Error fetching departments data from Google Sheets");
  }
});

//GET customes from google sheet
router.get("/customers", async (req, res) => {
  try {
    const range = "Sheet3!A2:C";
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    res.json(rows);
  } catch (err) {
    res.status(500).send("Error fetching customers data from Google Sheets");
  }
});

//GET suppliers from google sheet
router.get("/suppliers", async (req, res) => {
  try {
    const range = "Sheet4!A2:C";
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    res.json(rows);
  } catch (err) {
    res.status(500).send("Error fetching suppliers data from Google Sheets");
  }
});

//GET products from google sheet
router.get("/products", async (req, res) => {
  try {
    const range = "Sheet5!A2:D";
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    res.json(rows);
  } catch (err) {
    res.status(500).send("Error fetching products data from Google Sheets");
  }
});

//Get workstation from google sheet
router.get("/workstations", async (req, res) => {
  try {
    const range = "workstation!A2:D";
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    res.json(rows);
  } catch (err) {
    res.status(500).send("Error fetching workstation data from Google Sheets");
  }
});


// POST to add a new employee to Google Sheets
router.post("/employees", async (req, res) => {
  const { id, name, department, joiningDate, salary, email } = req.body;
  try {
    const values = [[id, name, department, joiningDate, salary, email]];
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:F", // Adjust range if needed
      valueInputOption: "RAW",
      resource: { values },
    });
    res.status(201).send("Employee added");
  } catch (err) {
    res.status(500).send("Error adding employee");
  }
});

// PUT to update an employee's data in Google Sheets
router.put("/employees/:rowIndex", async (req, res) => {
  const { rowIndex } = req.params;
  const { id, name, department, joiningDate, salary, email } = req.body;
  try {
    const values = [[id, name, department, joiningDate, salary, email]];
    const range = `Sheet1!A${parseInt(rowIndex) + 2}:F${parseInt(rowIndex) + 2
      }`; // Add 2 to account for header row
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: { values },
    });
    res.send("Employee updated");
  } catch (err) {
    res.status(500).send("Error updating employee");
  }
});




// DELETE an employee from Google Sheets by clearing the row
router.delete("/employees/:rowIndex", async (req, res) => {
  const { rowIndex } = req.params;
  try {
    const request = {
      spreadsheetId,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: "ROWS",
                startIndex: parseInt(rowIndex) + 1,
                endIndex: parseInt(rowIndex) + 2,
              },
            },
          },
        ],
      },
    };



    // Send batchUpdate request to delete the row
    await sheets.spreadsheets.batchUpdate(request);

    res.send("Employee row deleted");
  } catch (err) {
    console.error("Error deleting employee row:", err);
    res.status(500).send("Error deleting employee row");
  }
});

//POST customers data in google sheet
router.post('/customers', async (req, res) => {
  const { id, name, buyingDate } = req.body;
  try {

    const values = [[id, name, buyingDate]];
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet3!A2:C", //Adjust range if needed
      valueInputOption: "RAW",
      resource: { values },
    });
    res.status(201).send("Customer added successfully");
  } catch (err) {
    res.status(500).send("Error adding customer to Google Sheets");
  }
});

//POST suppliers data in google sheet
router.post('/suppliers', async (req, res) => {
  const { id, name, date } = req.body;
  try {
    const values = [[id, name, date]];
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet4!A2:C", //Adjust range if needed
      valueInputOption: "RAW",
      resource: { values },
    });
    res.status(201).send("Supplier added successfully");
  } catch (err) {
    res.status(500).send("Error adding customer to Google Sheets");
  }
});

// POST products to Google Sheets
router.post('/products', async (req, res) => {
  const { id, name, bname, deliveryDate } = req.body;
  
  try {
    const values = [[id, name, bname, deliveryDate]]; // Create a row array
      await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: "Sheet5!A2:D", // Specify the starting point for appending data
          valueInputOption: "RAW",
          resource: { values },
      });
      res.status(201).send("Product added successfully");
  } catch (err) {
      
      res.status(500).send("Error adding product to Google Sheets");
  }
});

// POST workstation to Google Sheets
router.post('/workstations', async (req, res) => {
  const { id, name, dname, sname } = req.body; // Extract workstation data from the request body

  try {
    const values = [[id, name, dname, sname]]; // Create an array for the row data
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "workstation!A2:D", // Specify the starting range for appending data
      valueInputOption: "RAW",
      resource: { values },
    });
    res.status(201).send("Workstation added successfully");
  } catch (err) {
    res.status(500).send("Error adding workstation to Google Sheets");
  }
});



module.exports = router;
