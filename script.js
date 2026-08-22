// ==========================================
// LOAD DATA FROM LOCAL STORAGE
// ==========================================

let students =
    JSON.parse(localStorage.getItem("students")) || [];

let subjects =
    JSON.parse(localStorage.getItem("subjects")) || [];

let attendance =
    JSON.parse(localStorage.getItem("attendance")) || [];


// ==========================================
// SAVE DATA
// ==========================================

function saveData() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );
}


// ==========================================
// ADD STUDENT
// ==========================================

function addStudent() {

    let input =
        document.getElementById("studentName");

    let name =
        input.value.trim();

    if (name === "") {

        alert("Please enter student name");

        return;
    }

    let student = {

        id: Date.now(),

        name: name

    };

    students.push(student);

    saveData();

    input.value = "";

    displayAll();
}


// ==========================================
// ADD SUBJECT
// ==========================================

function addSubject() {

    let input =
        document.getElementById("subjectName");

    let name =
        input.value.trim();

    if (name === "") {

        alert("Please enter subject name");

        return;
    }

    let subject = {

        id: Date.now(),

        name: name

    };

    subjects.push(subject);

    saveData();

    input.value = "";

    displayAll();
}


// ==========================================
// MARK ATTENDANCE
// ==========================================

function markAttendance(status) {

    let date =
        document.getElementById("attendanceDate").value;

    let studentId =
        document.getElementById("studentSelect").value;

    let subjectId =
        document.getElementById("subjectSelect").value;


    if (
        date === "" ||
        studentId === "" ||
        subjectId === ""
    ) {

        alert(
            "Please select date, student and subject"
        );

        return;
    }


    // Check duplicate attendance

    let existing =
        attendance.find(function(item) {

            return (
                item.date === date &&
                item.studentId == studentId &&
                item.subjectId == subjectId
            );

        });


    if (existing) {

        existing.status = status;

    } else {

        attendance.push({

            id: Date.now(),

            date: date,

            studentId: Number(studentId),

            subjectId: Number(subjectId),

            status: status

        });

    }


    saveData();

    displayAll();

    alert(
        "Attendance marked as " + status
    );
}


// ==========================================
// STUDENT DROPDOWN
// ==========================================

function displayStudentDropdown() {

    let select =
        document.getElementById("studentSelect");

    select.innerHTML =
        `<option value="">Select Student</option>`;


    students.forEach(function(student) {

        select.innerHTML += `

            <option value="${student.id}">
                ${student.name}
            </option>

        `;

    });
}


// ==========================================
// SUBJECT DROPDOWN
// ==========================================

function displaySubjectDropdown() {

    let select =
        document.getElementById("subjectSelect");

    select.innerHTML =
        `<option value="">Select Subject</option>`;


    subjects.forEach(function(subject) {

        select.innerHTML += `

            <option value="${subject.id}">
                ${subject.name}
            </option>

        `;

    });
}


// ==========================================
// SUMMARY
// ==========================================

function displaySummary() {

    document.getElementById(
        "totalStudents"
    ).textContent = students.length;


    document.getElementById(
        "totalSubjects"
    ).textContent = subjects.length;


    document.getElementById(
        "totalClasses"
    ).textContent = attendance.length;


    let present =
        attendance.filter(function(item) {

            return item.status === "Present";

        }).length;


    let absent =
        attendance.filter(function(item) {

            return item.status === "Absent";

        }).length;


    document.getElementById(
        "totalPresent"
    ).textContent = present;


    document.getElementById(
        "totalAbsent"
    ).textContent = absent;
}


// ==========================================
// STUDENT ATTENDANCE
// ==========================================

function displayStudentAttendance() {

    let tbody =
        document.getElementById(
            "studentAttendance"
        );

    tbody.innerHTML = "";


    students.forEach(function(student, index) {

        let records =
            attendance.filter(function(item) {

                return item.studentId === student.id;

            });


        let total =
            records.length;


        let present =
            records.filter(function(item) {

                return item.status === "Present";

            }).length;


        let absent =
            records.filter(function(item) {

                return item.status === "Absent";

            }).length;


        let percentage =
            total === 0
                ? 0
                : ((present / total) * 100).toFixed(2);


        tbody.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>${student.name}</td>

                <td>${total}</td>

                <td class="present-text">
                    ${present}
                </td>

                <td class="absent-text">
                    ${absent}
                </td>

                <td class="percentage">
                    ${percentage}%
                </td>

            </tr>

        `;

    });
}


// ==========================================
// SUBJECT ATTENDANCE
// ==========================================

function displaySubjectAttendance() {

    let tbody =
        document.getElementById(
            "subjectAttendance"
        );

    tbody.innerHTML = "";


    subjects.forEach(function(subject, index) {

        let records =
            attendance.filter(function(item) {

                return item.subjectId === subject.id;

            });


        let total =
            records.length;


        let present =
            records.filter(function(item) {

                return item.status === "Present";

            }).length;


        let absent =
            records.filter(function(item) {

                return item.status === "Absent";

            }).length;


        let percentage =
            total === 0
                ? 0
                : ((present / total) * 100).toFixed(2);


        tbody.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>${subject.name}</td>

                <td>${total}</td>

                <td class="present-text">
                    ${present}
                </td>

                <td class="absent-text">
                    ${absent}
                </td>

                <td class="percentage">
                    ${percentage}%
                </td>

            </tr>

        `;

    });
}


// ==========================================
// ATTENDANCE HISTORY
// ==========================================

function displayAttendanceHistory() {

    let tbody =
        document.getElementById(
            "attendanceHistory"
        );

    tbody.innerHTML = "";


    attendance
        .slice()
        .reverse()
        .forEach(function(item) {

            let student =
                students.find(function(student) {

                    return student.id === item.studentId;

                });


            let subject =
                subjects.find(function(subject) {

                    return subject.id === item.subjectId;

                });


            if (!student || !subject) {
                return;
            }


            let statusClass =
                item.status === "Present"
                    ? "present-text"
                    : "absent-text";


            tbody.innerHTML += `

                <tr>

                    <td>${item.date}</td>

                    <td>${student.name}</td>

                    <td>${subject.name}</td>

                    <td class="${statusClass}">
                        ${item.status}
                    </td>

                    <td>

                        <button
                            class="delete"
                            onclick="deleteAttendance(${item.id})">

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        });
}


// ==========================================
// STUDENT LIST
// ==========================================

function displayStudentList() {

    let tbody =
        document.getElementById("studentList");

    tbody.innerHTML = "";


    students.forEach(function(student, index) {

        tbody.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>${student.name}</td>

                <td>

                    <button
                        class="delete"
                        onclick="deleteStudent(${student.id})">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });
}


// ==========================================
// SUBJECT LIST
// ==========================================

function displaySubjectList() {

    let tbody =
        document.getElementById("subjectList");

    tbody.innerHTML = "";


    subjects.forEach(function(subject, index) {

        tbody.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>${subject.name}</td>

                <td>

                    <button
                        class="delete"
                        onclick="deleteSubject(${subject.id})">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });
}


// ==========================================
// DELETE STUDENT
// ==========================================

function deleteStudent(id) {

    if (!confirm("Delete this student?")) {
        return;
    }


    students =
        students.filter(function(student) {

            return student.id !== id;

        });


    attendance =
        attendance.filter(function(item) {

            return item.studentId !== id;

        });


    saveData();

    displayAll();
}


// ==========================================
// DELETE SUBJECT
// ==========================================

function deleteSubject(id) {

    if (!confirm("Delete this subject?")) {
        return;
    }


    subjects =
        subjects.filter(function(subject) {

            return subject.id !== id;

        });


    attendance =
        attendance.filter(function(item) {

            return item.subjectId !== id;

        });


    saveData();

    displayAll();
}


// ==========================================
// DELETE ATTENDANCE
// ==========================================

function deleteAttendance(id) {

    if (!confirm("Delete this attendance record?")) {
        return;
    }


    attendance =
        attendance.filter(function(item) {

            return item.id !== id;

        });


    saveData();

    displayAll();
}


// ==========================================
// RESET ALL DATA
// ==========================================

function resetAllData() {

    let confirmReset =
        confirm(
            "WARNING!\n\nThis will delete all students, subjects and attendance data.\n\nContinue?"
        );


    if (!confirmReset) {
        return;
    }


    students = [];

    subjects = [];

    attendance = [];


    localStorage.removeItem("students");

    localStorage.removeItem("subjects");

    localStorage.removeItem("attendance");


    displayAll();
}


// ==========================================
// DISPLAY EVERYTHING
// ==========================================

function displayAll() {

    displayStudentDropdown();

    displaySubjectDropdown();

    displaySummary();

    displayStudentAttendance();

    displaySubjectAttendance();

    displayAttendanceHistory();

    displayStudentList();

    displaySubjectList();
}


// ==========================================
// RUN WHEN PAGE LOADS
// ==========================================

displayAll();