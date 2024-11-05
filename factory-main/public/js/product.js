// Function to show the Add Product popup
document.getElementById('addProductsButton').addEventListener('click', function () {
    document.getElementById('addProductFormContainer').classList.add('active-popup');
});

// Function to hide the Add Product popup
document.getElementById('close-addProductForm-button').addEventListener('click', function () {
    document.getElementById('addProductFormContainer').classList.remove('active-popup');
});

// Function to handle form submission
document.getElementById('addProductForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get form data
    const productID = document.getElementById('id').value;
    const productName = document.getElementById('name').value;
    const buyerName = document.getElementById('bname').value;
    const deliveryDate = document.getElementById('deliveryDate').value;

    // Object to send to the API
    const productData = {
        id: productID,
        name: productName,
        bname: buyerName,
        deliveryDate: deliveryDate
    };

    try {
        // Call the API to save data to Google Sheets
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            // Add the product data to the table
            addProductToTable(productID, productName, buyerName, deliveryDate);

            // Reset the form
            document.getElementById('addProductForm').reset();

            // Hide the popup
            document.getElementById('addProductFormContainer').classList.remove('active-popup');
        } else {
            console.error('Error adding product:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Function to add a product to the table dynamically
function addProductToTable(id, name, bname, deliveryDate) {
    const tableBody = document.querySelector('#productTable tbody');
    const row = document.createElement('tr');

    // Insert cells into the row
    row.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${bname}</td>
        <td>${deliveryDate}</td>
    `;

    // Append the row to the table
    tableBody.appendChild(row);
}

// Fetching existing products from Google Sheets and populating the table
async function fetchProducts() {
    try {
        const response = await fetch("/api/products");
        const products = await response.json();

        // Loop through each product (which is an array)
        products.forEach((product) => {
            const id = product[0]; // Accessing index 0 for ID
            const name = product[1]; // Accessing index 1 for name
            const bname = product[2]; // Accessing index 2 for brand name
            const deliveryDate = product[3]; // Accessing index 3 for delivery date

            addProductToTable(id, name, bname, deliveryDate);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Call the fetchProducts function on page load to populate the table
window.onload = fetchProducts;
