// ======================================================
// ATTENDANCEPRO
// ATTENDANCE MANAGEMENT SYSTEM
// ======================================================

// ======================================================
// LOAD DATA
// ======================================================

let students =
    JSON.parse(localStorage.getItem("students")) || [];

let departments =
    JSON.parse(localStorage.getItem("departments")) || [];

let courses =
    JSON.parse(localStorage.getItem("courses")) || [];

let subjects =
    JSON.parse(localStorage.getItem("subjects")) || [];

let attendance =
    JSON.parse(localStorage.getItem("attendance")) || [];


// Temporary attendance marks
let attendanceMarks = {};


// ======================================================
// SAVE ATTENDANCE
// ======================================================

function saveAttendance() {

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );

}


// ======================================================
// CURRENT DATE
// ======================================================

function displayCurrentDate() {

    const element =
        document.getElementById("currentDate");

    if (!element) return;

    const today = new Date();

    element.textContent =
        today.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

}


// ======================================================
// DEFAULT DATE
// ======================================================

function setDefaultDate() {

    const input =
        document.getElementById("attendanceDate");

    if (!input) return;

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    input.value =
        `${year}-${month}-${day}`;

}


// ======================================================
// LOAD DEPARTMENTS
// ======================================================

function loadAttendanceDepartments() {

    const select =
        document.getElementById(
            "attendanceDepartment"
        );

    if (!select) return;

    select.innerHTML = `
        <option value="">
            Select Department
        </option>
    `;

    departments.forEach(function(department) {

        const option =
            document.createElement("option");

        option.value =
            department.id;

        option.textContent =
            department.name +
            " (" +
            department.code +
            ")";

        select.appendChild(option);

    });

}


// ======================================================
// UPDATE COURSES
// ======================================================

function updateAttendanceCourses() {

    const departmentId =
        document.getElementById(
            "attendanceDepartment"
        ).value;

    const courseSelect =
        document.getElementById(
            "attendanceCourse"
        );

    const semesterSelect =
        document.getElementById(
            "attendanceSemester"
        );

    const subjectSelect =
        document.getElementById(
            "attendanceSubject"
        );


    courseSelect.innerHTML = `
        <option value="">
            Select Course
        </option>
    `;

    semesterSelect.innerHTML = `
        <option value="">
            Select Semester
        </option>
    `;

    subjectSelect.innerHTML = `
        <option value="">
            Select Subject
        </option>
    `;

    attendanceMarks = {};

    clearAttendanceStudentTable();


    if (departmentId === "") {
        return;
    }


    const departmentCourses =
        courses.filter(function(course) {

            return String(course.departmentId) ===
                   String(departmentId);

        });


    departmentCourses.forEach(function(course) {

        const option =
            document.createElement("option");

        option.value =
            course.id;

        option.textContent =
            course.name +
            " (" +
            course.code +
            ")";

        courseSelect.appendChild(option);

    });

}


// ======================================================
// UPDATE SEMESTERS
// ======================================================

function updateAttendanceSemesters() {

    const courseId =
        document.getElementById(
            "attendanceCourse"
        ).value;

    const semesterSelect =
        document.getElementById(
            "attendanceSemester"
        );

    const subjectSelect =
        document.getElementById(
            "attendanceSubject"
        );


    semesterSelect.innerHTML = `
        <option value="">
            Select Semester
        </option>
    `;

    subjectSelect.innerHTML = `
        <option value="">
            Select Subject
        </option>
    `;

    attendanceMarks = {};

    clearAttendanceStudentTable();


    if (courseId === "") {
        return;
    }


    const semesterList = [
        "1st Semester",
        "2nd Semester",
        "3rd Semester",
        "4th Semester",
        "5th Semester",
        "6th Semester",
        "7th Semester",
        "8th Semester"
    ];


    const courseStudents =
        students.filter(function(student) {

            return String(student.courseId) ===
                   String(courseId);

        });


    semesterList.forEach(function(semester) {

        const exists =
            courseStudents.some(function(student) {

                return student.semester ===
                       semester;

            });


        if (exists) {

            const option =
                document.createElement("option");

            option.value =
                semester;

            option.textContent =
                semester;

            semesterSelect.appendChild(option);

        }

    });

}


// ======================================================
// UPDATE SUBJECTS
// ======================================================

function updateAttendanceSubjects() {

    const courseId =
        document.getElementById(
            "attendanceCourse"
        ).value;

    const semester =
        document.getElementById(
            "attendanceSemester"
        ).value;

    const subjectSelect =
        document.getElementById(
            "attendanceSubject"
        );


    subjectSelect.innerHTML = `
        <option value="">
            Select Subject
        </option>
    `;

    attendanceMarks = {};

    clearAttendanceStudentTable();


    if (
        courseId === "" ||
        semester === ""
    ) {
        return;
    }


    const courseSubjects =
        subjects.filter(function(subject) {

            const sameCourse =
                String(subject.courseId) ===
                String(courseId);


            const sameSemester =
                !subject.semester ||
                subject.semester === semester;


            return sameCourse &&
                   sameSemester;

        });


    courseSubjects.forEach(function(subject) {

        const option =
            document.createElement("option");

        option.value =
            subject.id;

        option.textContent =
            subject.name +
            (
                subject.code
                    ? " (" + subject.code + ")"
                    : ""
            );

        subjectSelect.appendChild(option);

    });

}


// ======================================================
// LOAD STUDENTS
// ======================================================

function loadAttendanceStudents() {

    const departmentId =
        document.getElementById(
            "attendanceDepartment"
        ).value;

    const courseId =
        document.getElementById(
            "attendanceCourse"
        ).value;

    const semester =
        document.getElementById(
            "attendanceSemester"
        ).value;

    const subjectId =
        document.getElementById(
            "attendanceSubject"
        ).value;


    if (
        !departmentId ||
        !courseId ||
        !semester ||
        !subjectId
    ) {

        clearAttendanceStudentTable();

        return;
    }


    const filteredStudents =
        students.filter(function(student) {

            return (
                String(student.departmentId) ===
                String(departmentId)

                &&

                String(student.courseId) ===
                String(courseId)

                &&

                student.semester ===
                semester
            );

        });


    // Keep existing marks if already selected
    filteredStudents.forEach(function(student) {

        if (!attendanceMarks.hasOwnProperty(student.id)) {

            attendanceMarks[student.id] =
                "Present";

        }

    });


    displayAttendanceStudents(
        filteredStudents
    );

}


// ======================================================
// DISPLAY STUDENTS
// ======================================================

function displayAttendanceStudents(list) {

    const table =
        document.getElementById(
            "attendanceStudentTable"
        );

    const count =
        document.getElementById(
            "attendanceStudentCount"
        );


    if (!table) return;


    if (count) {

        count.textContent =
            list.length + " Students";

    }


    if (list.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7"
                    class="empty-message">
                    No students found for selected
                    academic information.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML = "";


    list.forEach(function(student, index) {

        const records =
            attendance.filter(function(record) {

                return String(record.studentId) ===
                       String(student.id);

            });


        const total =
            records.length;


        const present =
            records.filter(function(record) {

                return record.status === "Present";

            }).length;


        const absent =
            records.filter(function(record) {

                return record.status === "Absent";

            }).length;


        const percentage =
            total === 0
                ? 0
                : ((present / total) * 100).toFixed(1);


        const status =
            attendanceMarks[student.id] ||
            "Present";


        const attendanceClass =
            Number(percentage) < 75
                ? "attendance-low"
                : "attendance-good";


        table.innerHTML += `

            <tr>

                <td>
                    ${index + 1}
                </td>

                <td>

                    <span class="code-badge">

                        ${escapeHTML(student.roll)}

                    </span>

                </td>

                <td>

                    <strong>

                        ${escapeHTML(student.name)}

                    </strong>

                </td>

                <td>
                    ${present}
                </td>

                <td>
                    ${absent}
                </td>

                <td>

                    <span class="${attendanceClass}">

                        ${percentage}%

                    </span>

                </td>

                <td>

                    <div class="attendance-mark-buttons">

                        <button
                            type="button"
                            class="${
                                status === "Present"
                                ? "btn btn-primary"
                                : "btn btn-secondary"
                            }"
                            onclick="markStudentAttendance(
                                ${student.id},
                                'Present'
                            )">

                            ✓ Present

                        </button>


                        <button
                            type="button"
                            class="${
                                status === "Absent"
                                ? "btn btn-primary"
                                : "btn btn-secondary"
                            }"
                            onclick="markStudentAttendance(
                                ${student.id},
                                'Absent'
                            )">

                            ✕ Absent

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

}


// ======================================================
// MARK STUDENT ATTENDANCE
// ======================================================

function markStudentAttendance(
    studentId,
    status
) {

    attendanceMarks[studentId] =
        status;


    // Only refresh current list.
    // Do NOT reset attendanceMarks.

    const departmentId =
        document.getElementById(
            "attendanceDepartment"
        ).value;

    const courseId =
        document.getElementById(
            "attendanceCourse"
        ).value;

    const semester =
        document.getElementById(
            "attendanceSemester"
        ).value;


    const filteredStudents =
        students.filter(function(student) {

            return (
                String(student.departmentId) ===
                String(departmentId)

                &&

                String(student.courseId) ===
                String(courseId)

                &&

                student.semester ===
                semester
            );

        });


    displayAttendanceStudents(
        filteredStudents
    );

}


// ======================================================
// SEARCH STUDENTS
// ======================================================

function searchAttendanceStudents() {

    const keyword =
        document.getElementById(
            "attendanceStudentSearch"
        ).value
        .trim()
        .toLowerCase();


    const departmentId =
        document.getElementById(
            "attendanceDepartment"
        ).value;

    const courseId =
        document.getElementById(
            "attendanceCourse"
        ).value;

    const semester =
        document.getElementById(
            "attendanceSemester"
        ).value;


    const filteredStudents =
        students.filter(function(student) {

            const name =
                (student.name || "")
                .toLowerCase();

            const roll =
                (student.roll || "")
                .toLowerCase();


            const matchSearch =
                keyword === "" ||
                name.includes(keyword) ||
                roll.includes(keyword);


            const matchDepartment =
                departmentId === "" ||
                String(student.departmentId) ===
                String(departmentId);


            const matchCourse =
                courseId === "" ||
                String(student.courseId) ===
                String(courseId);


            const matchSemester =
                semester === "" ||
                student.semester === semester;


            return (
                matchSearch &&
                matchDepartment &&
                matchCourse &&
                matchSemester
            );

        });


    displayAttendanceStudents(
        filteredStudents
    );

}


// ======================================================
// CLEAR STUDENT TABLE
// ======================================================

function clearAttendanceStudentTable() {

    const table =
        document.getElementById(
            "attendanceStudentTable"
        );

    const count =
        document.getElementById(
            "attendanceStudentCount"
        );


    if (table) {

        table.innerHTML = `
            <tr>
                <td colspan="7"
                    class="empty-message">

                    Select Department, Course,
                    Semester and Subject first.

                </td>
            </tr>
        `;

    }


    if (count) {

        count.textContent =
            "0 Students";

    }

}


// ======================================================
// SAVE ALL ATTENDANCE
// ======================================================

function saveAllAttendance() {

    const date =
        document.getElementById(
            "attendanceDate"
        ).value;

    const departmentId =
        document.getElementById(
            "attendanceDepartment"
        ).value;

    const courseId =
        document.getElementById(
            "attendanceCourse"
        ).value;

    const semester =
        document.getElementById(
            "attendanceSemester"
        ).value;

    const subjectId =
        document.getElementById(
            "attendanceSubject"
        ).value;


    if (!date) {

        alert(
            "Please select attendance date."
        );

        return;

    }


    if (
        !departmentId ||
        !courseId ||
        !semester ||
        !subjectId
    ) {

        alert(
            "Please select Department, Course, Semester and Subject."
        );

        return;

    }


    const selectedStudents =
        students.filter(function(student) {

            return (
                String(student.departmentId) ===
                String(departmentId)

                &&

                String(student.courseId) ===
                String(courseId)

                &&

                student.semester ===
                semester
            );

        });


    if (selectedStudents.length === 0) {

        alert(
            "No students found."
        );

        return;

    }


    let savedCount = 0;


    selectedStudents.forEach(function(student) {

        const status =
            attendanceMarks[student.id] ||
            "Present";


        const existingIndex =
            attendance.findIndex(function(record) {

                return (
                    String(record.studentId) ===
                    String(student.id)

                    &&

                    String(record.subjectId) ===
                    String(subjectId)

                    &&

                    record.date === date
                );

            });


        const record = {

            id:
                existingIndex !== -1
                    ? attendance[existingIndex].id
                    : Date.now() + Math.random(),

            studentId:
                student.id,

            departmentId:
                Number(departmentId),

            courseId:
                Number(courseId),

            semester:
                semester,

            subjectId:
                Number(subjectId),

            date:
                date,

            status:
                status

        };


        if (existingIndex !== -1) {

            attendance[existingIndex] =
                record;

        } else {

            attendance.push(record);

        }


        savedCount++;

    });


    saveAttendance();


    alert(
        savedCount +
        " student attendance saved successfully!"
    );


    updateAttendanceStats();

    displayAttendanceHistory();

}


// ======================================================
// UPDATE STATISTICS
// ======================================================

function updateAttendanceStats() {

    const total =
        attendance.length;


    const present =
        attendance.filter(function(record) {

            return record.status ===
                   "Present";

        }).length;


    const absent =
        attendance.filter(function(record) {

            return record.status ===
                   "Absent";

        }).length;


    const percentage =
        total === 0
            ? 0
            : ((present / total) * 100).toFixed(1);


    const totalElement =
        document.getElementById(
            "attendanceTotalClasses"
        );

    const presentElement =
        document.getElementById(
            "attendancePresent"
        );

    const absentElement =
        document.getElementById(
            "attendanceAbsent"
        );

    const averageElement =
        document.getElementById(
            "overallAttendance"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (presentElement) {

        presentElement.textContent =
            present;

    }


    if (absentElement) {

        absentElement.textContent =
            absent;

    }


    if (averageElement) {

        averageElement.textContent =
            percentage + "%";

    }

}


// ======================================================
// ATTENDANCE HISTORY
// ======================================================

function displayAttendanceHistory(
    list = attendance
) {

    const table =
        document.getElementById(
            "attendanceHistoryTable"
        );


    if (!table) return;


    if (list.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8"
                    class="empty-message">

                    No attendance records found.

                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML = "";


    const sorted =
        list.slice().sort(function(a, b) {

            return b.date.localeCompare(a.date);

        });


    sorted.forEach(function(record) {

        const student =
            students.find(function(item) {

                return String(item.id) ===
                       String(record.studentId);

            });


        const course =
            courses.find(function(item) {

                return String(item.id) ===
                       String(record.courseId);

            });


        const statusClass =
            record.status === "Present"
                ? "present-text"
                : "absent-text";


        table.innerHTML += `

            <tr>

                <td>
                    ${escapeHTML(record.date)}
                </td>

                <td>

                    ${
                        student
                        ? escapeHTML(student.name)
                        : "Unknown"
                    }

                </td>

                <td>

                    ${
                        student
                        ? escapeHTML(student.roll)
                        : "-"
                    }

                </td>

                <td>

                    ${
                        course
                        ? escapeHTML(course.name)
                        : "Unknown"
                    }

                </td>

                <td>

                    ${escapeHTML(record.semester)}

                </td>

                <td>

                    ${getSubjectName(record.subjectId)}

                </td>

                <td>

                    <span class="${statusClass}">

                        ${escapeHTML(record.status)}

                    </span>

                </td>

                <td>

                    <div class="action-buttons">

                        <button
                            class="view-btn"
                            onclick="viewAttendanceDetails('${record.id}')">

                            👁️

                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteAttendance('${record.id}')">

                            🗑️

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

}


// ======================================================
// SEARCH HISTORY
// ======================================================

function searchAttendanceHistory() {

    filterAttendanceHistory();

}


// ======================================================
// FILTER HISTORY
// ======================================================

function filterAttendanceHistory() {

    const keyword =
        document.getElementById(
            "attendanceHistorySearch"
        ).value
        .trim()
        .toLowerCase();


    const status =
        document.getElementById(
            "attendanceStatusFilter"
        ).value;


    const date =
        document.getElementById(
            "attendanceHistoryDate"
        ).value;


    const filtered =
        attendance.filter(function(record) {

            const student =
                students.find(function(item) {

                    return String(item.id) ===
                           String(record.studentId);

                });


            const subjectName =
                getSubjectName(
                    record.subjectId
                );


            const studentName =
                student
                    ? student.name.toLowerCase()
                    : "";


            const roll =
                student
                    ? student.roll.toLowerCase()
                    : "";


            const matchesSearch =
                keyword === "" ||
                studentName.includes(keyword) ||
                roll.includes(keyword) ||
                subjectName.toLowerCase()
                    .includes(keyword);


            const matchesStatus =
                status === "" ||
                record.status === status;


            const matchesDate =
                date === "" ||
                record.date === date;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesDate
            );

        });


    displayAttendanceHistory(
        filtered
    );

}


// ======================================================
// GET SUBJECT NAME
// ======================================================

function getSubjectName(id) {

    const subject =
        subjects.find(function(item) {

            return String(item.id) ===
                   String(id);

        });


    return subject
        ? escapeHTML(subject.name)
        : "Unknown Subject";

}


// ======================================================
// VIEW ATTENDANCE DETAILS
// ======================================================

function viewAttendanceDetails(id) {

    const record =
        attendance.find(function(item) {

            return String(item.id) ===
                   String(id);

        });


    if (!record) {

        alert(
            "Attendance record not found."
        );

        return;

    }


    const student =
        students.find(function(item) {

            return String(item.id) ===
                   String(record.studentId);

        });


    const department =
        departments.find(function(item) {

            return String(item.id) ===
                   String(record.departmentId);

        });


    const course =
        courses.find(function(item) {

            return String(item.id) ===
                   String(record.courseId);

        });


    const content =
        document.getElementById(
            "attendanceDetailsContent"
        );


    content.innerHTML = `

        <div class="profile-info-card">

            <h3>
                👨‍🎓 Student Information
            </h3>

            <p>
                <strong>Name:</strong>
                ${
                    student
                    ? escapeHTML(student.name)
                    : "Unknown"
                }
            </p>

            <p>
                <strong>Roll No:</strong>
                ${
                    student
                    ? escapeHTML(student.roll)
                    : "-"
                }
            </p>

            <p>
                <strong>Department:</strong>
                ${
                    department
                    ? escapeHTML(department.name)
                    : "Unknown"
                }
            </p>

            <p>
                <strong>Course:</strong>
                ${
                    course
                    ? escapeHTML(course.name)
                    : "Unknown"
                }
            </p>

            <p>
                <strong>Semester:</strong>
                ${escapeHTML(record.semester)}
            </p>

            <p>
                <strong>Subject:</strong>
                ${getSubjectName(record.subjectId)}
            </p>

            <p>
                <strong>Date:</strong>
                ${escapeHTML(record.date)}
            </p>

            <p>
                <strong>Status:</strong>

                <span class="${
                    record.status === "Present"
                    ? "present-text"
                    : "absent-text"
                }">

                    ${escapeHTML(record.status)}

                </span>

            </p>

        </div>

    `;


    document.getElementById(
        "attendanceDetailsModal"
    ).classList.add("show");

}


// ======================================================
// CLOSE DETAILS
// ======================================================

function closeAttendanceDetails() {

    const modal =
        document.getElementById(
            "attendanceDetailsModal"
        );


    if (modal) {

        modal.classList.remove("show");

    }

}


// ======================================================
// DELETE ATTENDANCE
// ======================================================

function deleteAttendance(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this attendance record?"
        );


    if (!confirmed) return;


    attendance =
        attendance.filter(function(record) {

            return String(record.id) !==
                   String(id);

        });


    saveAttendance();

    updateAttendanceStats();

    displayAttendanceHistory();


    alert(
        "Attendance record deleted successfully."
    );

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value == null
            ? ""
            : String(value);


    return div.innerHTML;

}


// ======================================================
// CLOSE MODAL OUTSIDE CLICK
// ======================================================

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "attendanceDetailsModal"
            );


        if (event.target === modal) {

            closeAttendanceDetails();

        }

    }
);


// ======================================================
// ESC KEY
// ======================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeAttendanceDetails();

        }

    }
);


// ======================================================
// INITIALIZE
// ======================================================

displayCurrentDate();

setDefaultDate();

loadAttendanceDepartments();

updateAttendanceStats();

displayAttendanceHistory();

clearAttendanceStudentTable();