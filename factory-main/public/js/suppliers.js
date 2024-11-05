// Function to show the Add Supplier popup
document.getElementById('addSupplierButton').addEventListener('click', function() {
    document.getElementById('addsupplierFormContainer').classList.add('active-popup');
});

// Function to hide the Add Supplier popup
document.getElementById('close-addSupplierForm-button').addEventListener('click', function() {
    document.getElementById('addsupplierFormContainer').classList.remove('active-popup');
});

// Function to handle form submission for adding a supplier
document.getElementById('addSupplierForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get form data
    const supplierID = document.getElementById('id').value;
    const supplierName = document.getElementById('name').value;
    const date = document.getElementById('Date').value;

    // Object to send to the API
    const supplierData = {
        id: supplierID,
        name: supplierName,
        date: date
    };

    try {
        // Call the API to save data to Google Sheets
        const response = await fetch('/api/suppliers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(supplierData)
        });

        if (response.ok) {
            // Add the supplier data to the table
            addSupplierToTable(supplierID, supplierName, date);

            // Reset the form
            document.getElementById('addSupplierForm').reset();

            // Hide the popup
            document.getElementById('addsupplierFormContainer').classList.remove('active-popup');
        } else {
            console.error('Error adding supplier:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Function to dynamically add a supplier to the table
function addSupplierToTable(id, name, date) {
    const tableBody = document.querySelector('#supplierTable tbody');
    const row = document.createElement('tr');

    // Insert cells into the row
    row.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${date}</td>
    `;

    // Append the row to the table
    tableBody.appendChild(row);
}

// Function to fetch suppliers from Google Sheets
async function fetchSuppliers() {
    try {
        // Make a GET request to your API endpoint
        const response = await fetch('/api/suppliers'); // Adjust the endpoint if necessary
       
        const suppliers = await response.json();

        // Loop through each supplier and add to the table
        suppliers.forEach(supplier => {
            const [id, name, date] = supplier; // Adjust if your data structure differs
            addSupplierToTable(id, name, date);
        });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
    }
}

// Call the fetchSuppliers function on page load to populate the table
window.onload = fetchSuppliers;
