
// ==========================================
// 1. SIDEBAR NAVIGATION
// ==========================================

const navLinks = document.querySelectorAll(".sidebar nav a");
const sections = document.querySelectorAll(".content-section");

navLinks.forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();

        const targetId = this.getAttribute("href").substring(1);

        sections.forEach(section => {
            section.hidden = true;
        });

        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.hidden = false;
        }

        navLinks.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
    });
});


// ==========================================
// 2. COMMON ELEMENTS
// ==========================================

const patientTableBody = document.getElementById("patientTableBody");

const patientFormsDropdowns = [
    "historyPatient",
    "medPatient",
    "reportPatient",
    "vitalPatient",
    "carePatient"
];


// ==========================================
// 3. UPDATE PATIENT DROPDOWNS
// ==========================================

function updatePatientDropdowns() {

    patientFormsDropdowns.forEach(dropdownId => {

        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;

        const selectedValue = dropdown.value;

        dropdown.innerHTML = '<option value="">Select Patient</option>';

        const patientRows = patientTableBody.querySelectorAll("tr");

        patientRows.forEach(row => {

            const name = row.cells[0].textContent;
            const patientId = row.cells[1].textContent;

            const option = document.createElement("option");

            option.value = patientId;
            option.textContent = name + " (" + patientId + ")";

            dropdown.appendChild(option);
        });

        if ([...dropdown.options].some(option => option.value === selectedValue)) {
            dropdown.value = selectedValue;
        }
    });
}

updatePatientDropdowns();


// ==========================================
// 4. UPGRADED DASHBOARD STATISTICS
// ==========================================

function updateDashboard() {

    const patientRows = [
        ...patientTableBody.querySelectorAll("tr")
    ];

    const historyCount =
        document.querySelectorAll("#historyTableBody tr").length;

    const medicationCount =
        document.querySelectorAll("#medicationTableBody tr").length;

    const reportCount =
        document.querySelectorAll("#reportTableBody tr").length;

    const vitalCount =
        document.querySelectorAll("#vitalTableBody tr").length;

    const careCount =
        document.querySelectorAll("#careTableBody tr").length;


    // PATIENT STATUS COUNTS

    let activeCount = 0;
    let monitoringCount = 0;
    let recoveredCount = 0;

    patientRows.forEach(row => {

        const status = row.cells[5].textContent.trim().toLowerCase();

        if (status === "active") activeCount++;
        else if (status === "monitoring") monitoringCount++;
        else if (status === "recovered") recoveredCount++;

    });


    // UPDATE PATIENT KPI CARDS

    document.getElementById("totalPatients").textContent = patientRows.length;
    document.getElementById("activePatients").textContent = activeCount;
    document.getElementById("monitoringPatients").textContent = monitoringCount;
    document.getElementById("recoveredPatients").textContent = recoveredCount;


    // UPDATE RECORD SUMMARY CARDS

    document.getElementById("totalHistory").textContent = historyCount;
    document.getElementById("totalMedications").textContent = medicationCount;
    document.getElementById("totalReports").textContent = reportCount;
    document.getElementById("totalVitals").textContent = vitalCount;
    document.getElementById("totalCarePlans").textContent = careCount;


    // PATIENT STATUS DONUT CHART

    const totalPatients = patientRows.length;

    const activePercentage = totalPatients
        ? (activeCount / totalPatients) * 100 : 0;

    const monitoringPercentage = totalPatients
        ? (monitoringCount / totalPatients) * 100 : 0;

    const recoveredPercentage = totalPatients
        ? (recoveredCount / totalPatients) * 100 : 0;

    const activeEnd = activePercentage;
    const monitoringEnd = activeEnd + monitoringPercentage;
    const recoveredEnd = monitoringEnd + recoveredPercentage;

    const donut = document.getElementById("patientDonut");

    donut.style.background = totalPatients
        ? `conic-gradient(
            #0f766e 0% ${activeEnd}%,
            #f59e0b ${activeEnd}% ${monitoringEnd}%,
            #8b5cf6 ${monitoringEnd}% ${recoveredEnd}%,
            #e5e7eb ${recoveredEnd}% 100%
        )`
        : "#e5e7eb";

    document.getElementById("donutTotal").textContent = totalPatients;
    document.getElementById("legendActive").textContent = activeCount;
    document.getElementById("legendMonitoring").textContent = monitoringCount;
    document.getElementById("legendRecovered").textContent = recoveredCount;


    // RECORD BAR CHARTS

    const recordCounts = [
        historyCount,
        medicationCount,
        reportCount,
        vitalCount,
        careCount
    ];

    const maxRecordCount = Math.max(...recordCounts, 1);

    const barData = [
        { bar: "barHistory", value: "barHistoryValue", count: historyCount },
        { bar: "barMedication", value: "barMedicationValue", count: medicationCount },
        { bar: "barReport", value: "barReportValue", count: reportCount },
        { bar: "barVital", value: "barVitalValue", count: vitalCount },
        { bar: "barCare", value: "barCareValue", count: careCount }
    ];

    barData.forEach(item => {

        const percentage = (item.count / maxRecordCount) * 100;

        document.getElementById(item.value).textContent = item.count;
        document.getElementById(item.bar).style.width = percentage + "%";

    });


    // RECENT PATIENTS

    const recentPatientsList = document.getElementById("recentPatientsList");

    recentPatientsList.innerHTML = "";

    const recentPatients = patientRows.slice(-4).reverse();

    if (recentPatients.length === 0) {

        recentPatientsList.innerHTML =
            '<p class="empty-dashboard">No patient records available.</p>';

    } else {

        recentPatients.forEach(row => {

            const name = row.cells[0].textContent;
            const patientId = row.cells[1].textContent;
            const condition = row.cells[4].textContent;
            const status = row.cells[5].textContent;

            const patientItem = document.createElement("div");
            patientItem.className = "recent-patient-item";

            const patientInfo = document.createElement("div");
            patientInfo.className = "patient-mini-info";

            const avatar = document.createElement("div");
            avatar.className = "patient-avatar";
            avatar.textContent = name.charAt(0).toUpperCase();

            const details = document.createElement("div");

            const patientName = document.createElement("strong");
            patientName.textContent = name;

            const patientDetails = document.createElement("small");
            patientDetails.textContent = patientId + " • " + condition;

            details.appendChild(patientName);
            details.appendChild(patientDetails);

            patientInfo.appendChild(avatar);
            patientInfo.appendChild(details);

            const statusBadge = document.createElement("span");
            statusBadge.className = "patient-status";

            const statusClass = status.toLowerCase();

            if (statusClass === "active") {
                statusBadge.classList.add("status-active");
            } else if (statusClass === "monitoring") {
                statusBadge.classList.add("status-monitoring");
            } else if (statusClass === "recovered") {
                statusBadge.classList.add("status-recovered");
            }

            statusBadge.textContent = status;

            patientItem.appendChild(patientInfo);
            patientItem.appendChild(statusBadge);

            recentPatientsList.appendChild(patientItem);

        });
    }


    // SYSTEM ACTIVITY SUMMARY

    document.getElementById("activityPatients").textContent =
        patientRows.length + " patients registered";

    document.getElementById("activityHistory").textContent =
        historyCount + " history records added";

    document.getElementById("activityMedications").textContent =
        medicationCount + " medications recorded";

    document.getElementById("activityReports").textContent =
        reportCount + " reports recorded";

}


// ==========================================
// 5. PATIENT REGISTRATION
// ==========================================

const patientForm = document.getElementById("patientForm");

patientForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("patientName").value.trim();
    const patientId = document.getElementById("patientId").value.trim();
    const age = document.getElementById("patientAge").value;
    const gender = document.getElementById("patientGender").value;
    const condition = document.getElementById("patientCondition").value.trim();
    const status = document.getElementById("patientStatus").value;

    const existingPatients = patientTableBody.querySelectorAll("tr");

    const duplicate = [...existingPatients].some(row =>
        row.cells[1].textContent.toLowerCase() === patientId.toLowerCase()
    );

    if (duplicate) {
        showMessage("formMessage", "This Patient ID already exists!", false);
        return;
    }

    const newRow = document.createElement("tr");

    addCells(newRow, [
        name,
        patientId,
        age,
        gender,
        condition,
        status
    ]);

    patientTableBody.appendChild(newRow);

    showMessage("formMessage", "Patient registered successfully!", true);

    patientForm.reset();

    updatePatientDropdowns();
    updateDashboard();

});


// ==========================================
// 6. PATIENT SEARCH
// ==========================================

const patientSearch = document.getElementById("patientSearch");

patientSearch.addEventListener("input", function() {

    const searchValue = this.value.toLowerCase();

    const rows = patientTableBody.querySelectorAll("tr");

    rows.forEach(row => {

        const patientInformation = row.textContent.toLowerCase();

        row.style.display = patientInformation.includes(searchValue)
            ? "" : "none";

    });

});


// ==========================================
// 7. VIEW PATIENT DETAILS
// ==========================================

patientTableBody.addEventListener("click", function(event) {

    const selectedRow = event.target.closest("tr");

    if (!selectedRow) return;

    const cells = selectedRow.querySelectorAll("td");

    if (cells.length !== 6) return;

    alert(
        "PATIENT DETAILS\n\n" +
        "Name: " + cells[0].textContent + "\n" +
        "Patient ID: " + cells[1].textContent + "\n" +
        "Age: " + cells[2].textContent + "\n" +
        "Gender: " + cells[3].textContent + "\n" +
        "Condition: " + cells[4].textContent + "\n" +
        "Status: " + cells[5].textContent
    );

});


// ==========================================
// 8. MEDICAL HISTORY
// ==========================================

const historyForm = document.getElementById("historyForm");

historyForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const patientId = document.getElementById("historyPatient").value;
    const diagnosis = document.getElementById("historyDiagnosis").value.trim();
    const date = document.getElementById("historyDate").value;
    const notes = document.getElementById("historyNotes").value.trim();

    const patient = findPatient(patientId);

    if (!patient) {
        showMessage("historyMessage", "Please select a valid patient.", false);
        return;
    }

    const row = document.createElement("tr");

    addCells(row, [
        patient.name,
        diagnosis,
        date,
        notes
    ]);

    document.getElementById("historyTableBody").appendChild(row);

    showMessage("historyMessage", "Medical history added successfully!", true);

    historyForm.reset();
    updateDashboard();

});


// ==========================================
// 9. MEDICATIONS
// ==========================================

const medicationForm = document.getElementById("medicationForm");

medicationForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const patientId = document.getElementById("medPatient").value;
    const medication = document.getElementById("medName").value.trim();
    const dosage = document.getElementById("medDosage").value.trim();
    const frequency = document.getElementById("medFrequency").value;
    const startDate = document.getElementById("medStartDate").value;

    const patient = findPatient(patientId);

    if (!patient) {
        showMessage("medicationMessage", "Please select a valid patient.", false);
        return;
    }

    const row = document.createElement("tr");

    addCells(row, [
        patient.name,
        medication,
        dosage,
        frequency,
        startDate
    ]);

    document.getElementById("medicationTableBody").appendChild(row);

    showMessage("medicationMessage", "Medication added successfully!", true);

    medicationForm.reset();
    updateDashboard();

});


// ==========================================
// 10. TEST REPORTS
// ==========================================

const reportForm = document.getElementById("reportForm");

reportForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const patientId = document.getElementById("reportPatient").value;
    const testName = document.getElementById("reportName").value.trim();
    const testDate = document.getElementById("reportDate").value;
    const result = document.getElementById("reportResult").value.trim();

    const patient = findPatient(patientId);

    if (!patient) {
        showMessage("reportMessage", "Please select a valid patient.", false);
        return;
    }

    const row = document.createElement("tr");

    addCells(row, [
        patient.name,
        testName,
        testDate,
        result
    ]);

    document.getElementById("reportTableBody").appendChild(row);

    showMessage("reportMessage", "Test report added successfully!", true);

    reportForm.reset();
    updateDashboard();

});


// ==========================================
// 11. VITAL SIGNS
// ==========================================

const vitalForm = document.getElementById("vitalForm");

vitalForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const patientId = document.getElementById("vitalPatient").value;
    const bloodPressure = document.getElementById("bloodPressure").value.trim();
    const heartRate = document.getElementById("heartRate").value;
    const temperature = document.getElementById("temperature").value;
    const date = document.getElementById("vitalDate").value;

    const patient = findPatient(patientId);

    if (!patient) {
        showMessage("vitalMessage", "Please select a valid patient.", false);
        return;
    }

    const row = document.createElement("tr");

    addCells(row, [
        patient.name,
        bloodPressure,
        heartRate + " bpm",
        temperature + " °C",
        date
    ]);

    document.getElementById("vitalTableBody").appendChild(row);

    showMessage("vitalMessage", "Vital signs saved successfully!", true);

    vitalForm.reset();
    updateDashboard();

});


// ==========================================
// 12. CARE INSTRUCTIONS
// ==========================================

const careForm = document.getElementById("careForm");

careForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const patientId = document.getElementById("carePatient").value;
    const title = document.getElementById("careTitle").value.trim();
    const description = document.getElementById("careDescription").value.trim();
    const date = document.getElementById("careDate").value;

    const patient = findPatient(patientId);

    if (!patient) {
        showMessage("careMessage", "Please select a valid patient.", false);
        return;
    }

    const row = document.createElement("tr");

    addCells(row, [
        patient.name,
        title,
        description,
        date
    ]);

    document.getElementById("careTableBody").appendChild(row);

    showMessage("careMessage", "Care instructions added successfully!", true);

    careForm.reset();
    updateDashboard();

});


// ==========================================
// 13. HELPER: FIND PATIENT
// ==========================================

function findPatient(patientId) {

    const rows = patientTableBody.querySelectorAll("tr");

    for (const row of rows) {

        if (row.cells[1].textContent === patientId) {

            return {
                name: row.cells[0].textContent,
                id: row.cells[1].textContent
            };

        }
    }

    return null;
}


// ==========================================
// 14. HELPER: ADD TABLE CELLS
// ==========================================

function addCells(row, values) {

    values.forEach(value => {

        const cell = document.createElement("td");
        cell.textContent = value;

        row.appendChild(cell);

    });

}


// ==========================================
// 15. HELPER: SHOW MESSAGES
// ==========================================

function showMessage(elementId, message, success) {

    const messageElement = document.getElementById(elementId);

    messageElement.textContent = message;

    messageElement.className = success
        ? "success-message"
        : "error-message";

}


// ==========================================
// 16. DASHBOARD INITIALIZATION
// ==========================================

updateDashboard();


// VIEW PATIENTS BUTTON

const viewPatientsBtn = document.getElementById("viewPatientsBtn");

if (viewPatientsBtn) {

    viewPatientsBtn.addEventListener("click", function() {

        const patientsLink = document.querySelector(
            '.sidebar nav a[href="#patients"]'
        );

        if (patientsLink) {
            patientsLink.click();
        }

    });

}
