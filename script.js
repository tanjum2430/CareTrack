
// ==========================================
// 1. SIDEBAR NAVIGATION FUNCTIONALITY
// ==========================================

const navLinks = document.querySelectorAll(".sidebar nav a");
const sections = document.querySelectorAll(".content-section");

navLinks.forEach(link => {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        // Get the selected section ID
        const targetId = this.getAttribute("href").substring(1);

        // Hide all sections
        sections.forEach(section => {
            section.hidden = true;
        });

        // Show the selected section
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.hidden = false;
        }

        // Remove active class from all links
        navLinks.forEach(item => {
            item.classList.remove("active");
        });

        // Highlight selected link
        this.classList.add("active");

    });

});


// ==========================================
// 2. PATIENT REGISTRATION FUNCTIONALITY
// ==========================================

const patientForm = document.getElementById("patientForm");

if (patientForm) {

    patientForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("patientName").value.trim();
        const id = document.getElementById("patientId").value.trim();
        const age = document.getElementById("patientAge").value;
        const gender = document.getElementById("patientGender").value;
        const condition = document.getElementById("patientCondition").value.trim();
        const status = document.getElementById("patientStatus").value;

        const message = document.getElementById("formMessage");
        const tableBody = document.getElementById("patientTableBody");

        if (!tableBody) {
            console.error("Patient table body not found!");
            return;
        }

        // Check for duplicate Patient ID
        const existingIds = Array.from(tableBody.rows).map(row =>
            row.cells[1].textContent.trim().toLowerCase()
        );

        if (existingIds.includes(id.toLowerCase())) {

            message.textContent = "This Patient ID already exists!";
            message.style.color = "red";

            return;
        }

        // Create new patient row
        const newRow = document.createElement("tr");

        const patientData = [
            name,
            id,
            age,
            gender,
            condition,
            status
        ];

        patientData.forEach(data => {

            const cell = document.createElement("td");
            cell.textContent = data;
            newRow.appendChild(cell);

        });

        tableBody.appendChild(newRow);

        message.textContent = "Patient registered successfully!";
        message.style.color = "green";

        patientForm.reset();

        console.log("New patient registered:", name);

    });

}


// ==========================================
// 3. PATIENT SEARCH FUNCTIONALITY
// ==========================================

const patientSearch = document.getElementById("patientSearch");

if (patientSearch) {

    patientSearch.addEventListener("input", function() {

        const searchValue = patientSearch.value.toLowerCase();

        const rows = document.querySelectorAll("#patientTableBody tr");

        rows.forEach(function(row) {

            const patientInformation = row.textContent.toLowerCase();

            if (patientInformation.includes(searchValue)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }

        });

    });

}


// ==========================================
// 4. VIEW PATIENT DETAILS FUNCTIONALITY
// ==========================================

const patientTableBody = document.getElementById("patientTableBody");

if (patientTableBody) {

    patientTableBody.addEventListener("click", function(event) {

        const row = event.target.closest("tr");

        if (!row) return;

        const cells = row.cells;

        const name = cells[0].textContent;
        const patientId = cells[1].textContent;
        const age = cells[2].textContent;
        const gender = cells[3].textContent;
        const condition = cells[4].textContent;
        const status = cells[5].textContent;

        alert(
            "PATIENT DETAILS\n\n" +
            "Name: " + name + "\n" +
            "Patient ID: " + patientId + "\n" +
            "Age: " + age + "\n" +
            "Gender: " + gender + "\n" +
            "Condition: " + condition + "\n" +
            "Status: " + status
        );

    });

}

// ==========================================
// 5. MEDICAL HISTORY FUNCTIONALITY
// ==========================================

const historyForm = document.getElementById("historyForm");

if (historyForm) {

    const historyPatient = document.getElementById("historyPatient");
    const historyTableBody = document.getElementById("historyTableBody");

    // Load registered patients into the dropdown
    const patientRows = document.querySelectorAll(
        "#patientTableBody tr"
    );

    patientRows.forEach(row => {

        const patientName = row.cells[0].textContent;
        const patientId = row.cells[1].textContent;

        const option = document.createElement("option");

        option.value = patientId;
        option.textContent = patientName + " (" + patientId + ")";

        historyPatient.appendChild(option);

    });

    // Add a medical history record
    historyForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const selectedPatient =
            historyPatient.options[historyPatient.selectedIndex].textContent;

        const diagnosis =
            document.getElementById("historyDiagnosis").value.trim();

        const date =
            document.getElementById("historyDate").value;

        const notes =
            document.getElementById("historyNotes").value.trim();

        const newRow = document.createElement("tr");

        const recordData = [
            selectedPatient,
            diagnosis,
            date,
            notes
        ];

        recordData.forEach(data => {

            const cell = document.createElement("td");

            cell.textContent = data;

            newRow.appendChild(cell);

        });

        historyTableBody.appendChild(newRow);

        document.getElementById("historyMessage").textContent =
            "Medical history added successfully!";

        document.getElementById("historyMessage").style.color = "green";

        historyForm.reset();

    });

}
