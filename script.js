
// POLIKLINIKA NAVBAT TIZIMI

// Ish vaqti konstantasi
const WORK_START = "08:00";
const WORK_END = "16:00";

// Ma'lumotlar
let patients = [];
let queue = [];

// Shifokorlar ro'yxati
const doctors = [
    {
        id: 1,
        name: "Aliyev Anvar",
        specialty: "Terapevt",
        days: "Dushanba - Juma",
        start: "08:00",
        end: "16:00"
    },
    {
        id: 2,
        name: "Karimova Dilnoza",
        specialty: "Pediatr",
        days: "Dushanba - Shanba",
        start: "09:00",
        end: "15:00"
    },
    {
        id: 3,
        name: "Rasulov Sardor",
        specialty: "Jarroh",
        days: "Dushanba - Juma",
        start: "08:00",
        end: "14:00"
    }
];

// Sahifa yuklanganda bajariladi
document.addEventListener("DOMContentLoaded", function () {
    displayDoctors();
    loadPatients();
    loadQueue();
});

// Shifokorlarni jadvalga chiqarish
function displayDoctors() {
    const doctorList = document.getElementById("doctorList");

    if (!doctorList) return;

    doctorList.innerHTML = "";

    doctors.forEach((doctor, index) => {
        const row = document.createElement("tr");

        [
            index + 1,
            doctor.name,
            doctor.specialty,
            doctor.days,
            doctor.start + " - " + doctor.end
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        doctorList.appendChild(row);
    });

    updateDoctorSelect();
}
// Shifokorning qabul kunini tekshirish
function isDoctorAvailable(doctor, selectedDate) {
    const date = new Date(selectedDate + "T00:00:00");
    const day = date.getDay();

    const availableDays = {
        "Dushanba - Juma": [1, 2, 3, 4, 5],
        "Dushanba - Shanba": [1, 2, 3, 4, 5, 6],
        "Har kuni": [0, 1, 2, 3, 4, 5, 6]
    };

    const days = availableDays[doctor.days] || [];

    return days.includes(day);
}
// Shifokor tanlash ro'yxati
function updateDoctorSelect() {
    const select = document.getElementById("queueDoctor");

    if (!select) return;

    select.innerHTML = '<option value="">Shifokorni tanlang</option>';

    doctors.forEach(doctor => {
        const option = document.createElement("option");
        option.value = doctor.id;
        option.textContent = doctor.name + " (" + doctor.specialty + ")";
        select.appendChild(option);
    });
}

// Bemorni ro'yxatga olish
const patientForm = document.getElementById("patientForm");

if (patientForm) {
    patientForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const patient = {
            id: Date.now(),
            fullname: document.getElementById("fullname").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            birthdate: document.getElementById("birthdate").value,
            address: document.getElementById("address").value.trim()
        };

        if (!patient.fullname || !patient.phone ||
            !patient.birthdate || !patient.address) {
            alert("Barcha maydonlarni to'ldiring!");
            return;
        }

        patients.push(patient);
        savePatients();
        displayPatients();

        patientForm.reset();
        alert("Bemor muvaffaqiyatli ro'yxatga olindi!");
    });
}

// Bemorlarni jadvalga chiqarish
function displayPatients() {
    const patientList = document.getElementById("patientList");
    const patientSelect = document.getElementById("queuePatient");

    if (patientList) {
        patientList.innerHTML = "";

        patients.forEach((patient, index) => {
            const row = document.createElement("tr");

            [
                index + 1,
                patient.fullname,
                patient.phone,
                patient.birthdate,
                patient.address
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            patientList.appendChild(row);
        });
    }

    if (patientSelect) {
        patientSelect.innerHTML =
            '<option value="">Bemorni tanlang</option>';

        patients.forEach(patient => {
            const option = document.createElement("option");
            option.value = patient.id;
            option.textContent = patient.fullname;
            patientSelect.appendChild(option);
        });
    }
}

// Bemorlarni saqlash
function savePatients() {
    localStorage.setItem("patients", JSON.stringify(patients));
}

// Bemorlarni yuklash
function loadPatients() {
    patients = JSON.parse(localStorage.getItem("patients")) || [];
    displayPatients();
}

// Navbatga yozish
const queueForm = document.getElementById("queueForm");

if (queueForm) {
    queueForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const patientId =
            Number(document.getElementById("queuePatient").value);

        const doctorId =
            Number(document.getElementById("queueDoctor").value);

        const date = document.getElementById("queueDate").value;

        if (!patientId || !doctorId || !date) {
            alert("Barcha maydonlarni to'ldiring!");
            return;
        }

        const patient = patients.find(item => item.id === patientId);
        const doctor = doctors.find(item => item.id === doctorId);

        if (!patient || !doctor) {
            alert("Bemor yoki shifokor topilmadi!");
            return;
        }
        // Shifokorning qabul kunini tekshirish
if (!isDoctorAvailable(doctor, date)) {
    alert("Tanlangan kunda shifokor qabul qilmaydi!");
    return;
}

        const appointment = {
            id: Date.now(),
            number: queue.length + 1,
            patientName: patient.fullname,
            doctorName: doctor.name,
            date: date,
            status: "Kutilmoqda"
        };

        queue.push(appointment);
        saveQueue();
        displayQueue();

        queueForm.reset();
        alert("Bemor navbatga muvaffaqiyatli yozildi!");
    });
}

// Navbatlarni jadvalga chiqarish
function displayQueue() {
    const queueList = document.getElementById("queueList");

    if (!queueList) return;

    queueList.innerHTML = "";

    queue.forEach(item => {
        const row = document.createElement("tr");

        [
            item.number,
            item.patientName,
            item.doctorName,
            item.date,
            item.status
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        queueList.appendChild(row);
    });
}

// Navbatlarni saqlash
function saveQueue() {
    localStorage.setItem("queue", JSON.stringify(queue));
}

// Navbatlarni yuklash
function loadQueue() {
    queue = JSON.parse(localStorage.getItem("queue")) || [];
    displayQueue();
}

