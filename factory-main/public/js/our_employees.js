document
  .getElementById("addNewEmployeeButton")
  .addEventListener("click", function () {
    var Elementtopopup = document.getElementById("addNewEmployeeFormContainer");
    if (Elementtopopup) {
      Elementtopopup.classList.add("active-popup");
    }
  });
document
  .getElementById("close-addEmployeeForm-button")
  .addEventListener("click", function () {
    // Find the element with the 'popup' class
    var popupElement = document.getElementById("addNewEmployeeFormContainer");

    // Add the 'active-popup' class to it
    if (popupElement) {
      popupElement.classList.remove("active-popup");
    }
    var formElement = document.getElementById("addEmployeeForm");
    if (formElement) {
      formElement.reset();
    }
  });
document
  .getElementById("close-editEmployeeForm-button")
  .addEventListener("click", function () {
    // Find the element with the 'popup' class
    var popupElement = document.getElementById("editEmployeeFormContainer");

    // Add the 'active-popup' class to it
    if (popupElement) {
      popupElement.classList.remove("active-popup");
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  const employeeTable = document.querySelector("#employeeTable tbody");
  const addEmployeeForm = document.getElementById("addEmployeeForm");
  const departmentFilter = document.getElementById("departmentFilter");
  const departmentOptionsContainers = document.querySelectorAll(
    ".departmentOptionsContainer"
  );
  // Function to populate departments
  async function fetchDepartments() {
    try {
      const response = await fetch("/api/departments");
      const departments = await response.json();

      // Add each department as an option
      departments.forEach((department) => {
        departmentOptionsContainers.forEach((departmentOptionsContainer) => {
          const option = document.createElement("option");
          option.value = department[1];
          option.textContent = department[1];
          departmentOptionsContainer.appendChild(option);
        });
      });
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }
  // Populate all departments into all select elements
  fetchDepartments();

  // Fetch and display all employees
  async function fetchEmployees(department = "") {
    try {
      const res = await fetch("/api/employees");

      // Ensure the response is valid JSON, even if empty
      let employees = [];
      if (res.ok) {
        const text = await res.text(); // Get the raw response as text
        employees = text ? JSON.parse(text) : []; // Parse it to JSON if not empty
      }

      // Clear the current table rows
      employeeTable.innerHTML = "";

      // Filter employees by department if a department is selected
      const filteredEmployees = department
        ? employees.filter((emp) => emp[2] === department)
        : employees;

      // Populate the employee table
      filteredEmployees.forEach((employee, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${employee[0]}</td>
                <td>${employee[1]}</td>
                <td>${employee[2]}</td>
                <td>${employee[3]}</td>
                <td>${employee[4]}</td>
                <td>${employee[5]}</td>
                <td>
                    <button onclick="editEmployee(${index})" class="btn editEmployeeButton">Edit</button>
                    <button onclick="deleteEmployee(${index})" class="btn deleteEmployeeButton">Delete</button>
                </td>
            `;
        employeeTable.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }

  // Fetch all employees on page load
  fetchEmployees();

  // Handle form submission for adding a new employee
  addEmployeeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newEmployee = {
      id: document.getElementById("id").value,
      name: document.getElementById("name").value,
      department: document.getElementById("department").value,
      joiningDate: document.getElementById("joiningDate").value,
      salary: document.getElementById("salary").value,
      email: document.getElementById("email").value,
    };

    // Send POST request to backend to add new employee
    await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee),
    });

    // Re-fetch employees after adding the new one
    fetchEmployees();
    var Elementtopopup = document.getElementById("addNewEmployeeFormContainer");
    if (Elementtopopup) {
      Elementtopopup.classList.remove("active-popup");
    }
    var formElement = document.getElementById("addEmployeeForm");
    if (formElement) {
      formElement.reset();
    }
  });

  // Filter employees by department
  departmentFilter.addEventListener("change", () => {
    const selectedDepartment = departmentFilter.value;
    fetchEmployees(selectedDepartment);
  });

  // Delete employee function
  window.deleteEmployee = async (index) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      // Send DELETE request to backend
      const response = await fetch(`/api/employees/${index}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Re-fetch employees after deletion
        fetchEmployees(); // Fetch and display updated list of employees
      } else {
        console.error("Failed to delete employee");
      }
    }
  };

  // Edit employee function
  window.editEmployee = (index) => {
    const employeeRows = document.querySelectorAll("#employeeTable tbody tr");
    const selectedRow = employeeRows[index].children;

    // Populate the edit form with the existing data
    document.getElementById("editId").value = selectedRow[0].innerText;
    document.getElementById("editName").value = selectedRow[1].innerText;
    document.getElementById("editDepartment").value = selectedRow[2].innerText;
    document.getElementById("editJoiningDate").value = selectedRow[3].innerText;
    document.getElementById("editSalary").value = selectedRow[4].innerText;
    document.getElementById("editEmail").value = selectedRow[5].innerText;

    // Show the edit form
    document.getElementById("editEmployeeForm").style.display = "block";
    var Elementtopopup = document.getElementById("editEmployeeFormContainer");
    if (Elementtopopup) {
      Elementtopopup.classList.add("active-popup");
    }

    // Submit the updated employee data
    document.getElementById("editEmployeeForm").onsubmit = async (e) => {
      e.preventDefault();

      const updatedEmployee = {
        id: document.getElementById("editId").value,
        name: document.getElementById("editName").value,
        department: document.getElementById("editDepartment").value,
        joiningDate: document.getElementById("editJoiningDate").value,
        salary: document.getElementById("editSalary").value,
        email: document.getElementById("editEmail").value,
      };

      // Send PUT request to update the employee in the backend
      await fetch(`/api/employees/${index}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEmployee),
      });

      // Hide the edit form and refresh the table
      var Elementtopopup = document.getElementById("editEmployeeFormContainer");
      if (Elementtopopup) {
        Elementtopopup.classList.remove("active-popup");
      }
      fetchEmployees();
    };
  };
});
