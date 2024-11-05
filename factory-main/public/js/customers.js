// Function to show the Add Customer popup
document.getElementById('addCustomerButton').addEventListener('click', function() {
    document.getElementById('addCustomerFormContainer').classList.add('active-popup');
});

// Function to hide the Add Customer popup
document.getElementById('close-addCustomerForm-button').addEventListener('click', function() {
    document.getElementById('addCustomerFormContainer').classList.remove('active-popup');
});

// Function to handle form submission
document.getElementById('addCustomerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get form data
    const customerID = document.getElementById('id').value;
    const customerName = document.getElementById('name').value;
    const buyingDate = document.getElementById('buyingDate').value;

    // Object to send to the API
    const customerData = {
        id: customerID,
        name: customerName,
        buyingDate: buyingDate
    };

    try {
        // Call the API to save data to Google Sheets
        const response = await fetch('/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        });

        if (response.ok) {
            // Add the customer data to the table
            addCustomerToTable(customerID, customerName, buyingDate);

            // Reset the form
            document.getElementById('addCustomerForm').reset();

            // Hide the popup
            document.getElementById('addCustomerFormContainer').classList.remove('active-popup');
        } else {
            console.error('Error adding customer:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Function to add a customer to the table dynamically
function addCustomerToTable(id, name, buyingDate) {
    const tableBody = document.querySelector('#customerTable tbody');
    const row = document.createElement('tr');

    // Insert cells into the row
    row.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${buyingDate}</td>
    `;

    // Append the row to the table
    tableBody.appendChild(row);
}

// Fetching existing customers from Google Sheets and populating the table
async function fetchCustomers() {
    try {
        const response = await fetch('/api/customers');
        const customers = await response.json();

        // Loop through each customer and add to the table
        customers.forEach(customer => {
            const [id, name, buyingDate] = customer;
            addCustomerToTable(id, name, buyingDate);
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
}

// Call the fetchCustomers function on page load to populate the table
window.onload = fetchCustomers;
