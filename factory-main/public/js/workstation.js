// Function to show the Add Workstation popup
document.getElementById('addWorkstationButton').addEventListener('click', function () {
    document.getElementById('addWorkstationFormContainer').classList.add('active-popup');
});

// Function to hide the Add Workstation popup
document.getElementById('close-addWorkstationForm-button').addEventListener('click', function () {
    document.getElementById('addWorkstationFormContainer').classList.remove('active-popup');
});

// Function to handle form submission
document.getElementById('addWorkstationForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get form data
    const workstationID = document.getElementById('id').value;
    const workstationName = document.getElementById('name').value;
    const departmentName = document.getElementById('dname').value;
    const station = document.getElementById('sname').value;

    // Object to send to the API
    const workstationData = {
        id: workstationID,
        name: workstationName,
        dname: departmentName,
        sname: station
    };

    try {
        // Call the API to save data to Google Sheets
        const response = await fetch('/api/workstations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workstationData)
        });

        if (response.ok) {
            // Add the workstation data to the table
            addWorkstationToTable(workstationID, workstationName, departmentName, station);

            // Reset the form
            document.getElementById('addWorkstationForm').reset();

            // Hide the popup
            document.getElementById('addWorkstationFormContainer').classList.remove('active-popup');
        } else {
            console.error('Error adding workstation:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Function to add a workstation to the table dynamically
function addWorkstationToTable(id, name, dname, sname) {
    const tableBody = document.querySelector('#workstationTable tbody');
    const row = document.createElement('tr');

    // Insert cells into the row
    row.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${dname}</td>
        <td>${sname}</td>
    `;

    // Append the row to the table
    tableBody.appendChild(row);
}

// Fetching existing workstations from Google Sheets and populating the table
async function fetchWorkstations() {
    try {
        const response = await fetch("/api/workstations");
        const workstations = await response.json();

        // Loop through each workstation (which is an array)
        workstations.forEach((workstation) => {
            const id = workstation[0];         // Accessing index 0 for Workstation ID
            const name = workstation[1];       // Accessing index 1 for Workstation Name
            const dname = workstation[2];      // Accessing index 2 for Department Name
            const sname = workstation[3];      // Accessing index 3 for Station

            addWorkstationToTable(id, name, dname, sname);
        });
    } catch (error) {
        console.error("Error fetching workstations:", error);
    }
}

// Call the fetchWorkstations function on page load to populate the table
window.onload = fetchWorkstations;
