// ======================================================
// ATTENDANCEPRO
// STUDENT MANAGEMENT SYSTEM
// ======================================================


// ======================================================
// LOAD DATA FROM LOCAL STORAGE
// ======================================================

let students =
    JSON.parse(localStorage.getItem("students")) || [];

let departments =
    JSON.parse(localStorage.getItem("departments")) || [];

let courses =
    JSON.parse(localStorage.getItem("courses")) || [];

let attendance =
    JSON.parse(localStorage.getItem("attendance")) || [];


// ======================================================
// SAVE STUDENTS
// ======================================================

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
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
        today.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );
}


// ======================================================
// OPEN STUDENT MODAL
// ======================================================

function openStudentModal() {

    const modal =
        document.getElementById("studentModal");

    const form =
        document.getElementById("studentForm");

    form.reset();

    document.getElementById(
        "editStudentId"
    ).value = "";

    document.getElementById(
        "studentModalTitle"
    ).textContent = "Add Student";

    loadStudentDepartments();

    document.getElementById(
        "studentCourse"
    ).innerHTML = `
        <option value="">
            Select Course
        </option>
    `;

    modal.classList.add("show");
}


// ======================================================
// CLOSE STUDENT MODAL
// ======================================================

function closeStudentModal() {

    const modal =
        document.getElementById("studentModal");

    modal.classList.remove("show");
}


// ======================================================
// LOAD DEPARTMENTS
// ======================================================

function loadStudentDepartments(
    selectedId = ""
) {

    const select =
        document.getElementById(
            "studentDepartment"
        );

    if (!select) return;

    select.innerHTML = `
        <option value="">
            Select Department
        </option>
    `;

    departments.forEach(
        function(department) {

            const option =
                document.createElement("option");

            option.value =
                department.id;

            option.textContent =
                department.name +
                " (" +
                department.code +
                ")";

            if (
                String(department.id) ===
                String(selectedId)
            ) {

                option.selected = true;
            }

            select.appendChild(option);
        }
    );
}


// ======================================================
// LOAD COURSES ACCORDING TO DEPARTMENT
// ======================================================

function loadStudentCourses(
    selectedCourseId = ""
) {

    const departmentId =
        document.getElementById(
            "studentDepartment"
        ).value;

    const courseSelect =
        document.getElementById(
            "studentCourse"
        );

    courseSelect.innerHTML = `
        <option value="">
            Select Course
        </option>
    `;

    if (departmentId === "") {
        return;
    }

    const departmentCourses =
        courses.filter(
            function(course) {

                return String(
                    course.departmentId
                ) ===
                String(
                    departmentId
                );

            }
        );

    departmentCourses.forEach(
        function(course) {

            const option =
                document.createElement("option");

            option.value =
                course.id;

            option.textContent =
                course.name +
                " (" +
                course.code +
                ")";

            if (
                String(course.id) ===
                String(selectedCourseId)
            ) {

                option.selected = true;
            }

            courseSelect.appendChild(option);

        }
    );
}


// ======================================================
// SAVE STUDENT
// ======================================================

function saveStudent(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "studentName"
        ).value.trim();


    const roll =
        document.getElementById(
            "studentRoll"
        ).value.trim();


    const email =
        document.getElementById(
            "studentEmail"
        ).value.trim();


    const phone =
        document.getElementById(
            "studentPhone"
        ).value.trim();


    const departmentId =
        document.getElementById(
            "studentDepartment"
        ).value;


    const courseId =
        document.getElementById(
            "studentCourse"
        ).value;


    const semester =
        document.getElementById(
            "studentSemester"
        ).value;


    const admissionYear =
        document.getElementById(
            "studentAdmissionYear"
        ).value;


    const address =
        document.getElementById(
            "studentAddress"
        ).value.trim();


    const editId =
        document.getElementById(
            "editStudentId"
        ).value;


    // ==================================================
    // VALIDATION
    // ==================================================

    if (name === "") {

        alert(
            "Please enter student name."
        );

        return;
    }


    if (roll === "") {

        alert(
            "Please enter roll number."
        );

        return;
    }


    if (departmentId === "") {

        alert(
            "Please select department."
        );

        return;
    }


    if (courseId === "") {

        alert(
            "Please select course."
        );

        return;
    }


    if (semester === "") {

        alert(
            "Please select semester."
        );

        return;
    }


    if (admissionYear === "") {

        alert(
            "Please enter admission year."
        );

        return;
    }


    // ==================================================
    // CHECK DUPLICATE ROLL
    // ==================================================

    const duplicateRoll =
        students.find(
            function(student) {

                return (

                    student.roll
                        .toLowerCase() ===
                    roll.toLowerCase()

                    &&

                    String(student.id) !==
                    String(editId)

                );

            }
        );


    if (duplicateRoll) {

        alert(
            "This roll number already exists."
        );

        return;
    }


    // ==================================================
    // EDIT STUDENT
    // ==================================================

    if (editId !== "") {

        const student =
            students.find(
                function(item) {

                    return String(item.id) ===
                        String(editId);

                }
            );


        if (student) {

            student.name =
                name;

            student.roll =
                roll;

            student.email =
                email;

            student.phone =
                phone;

            student.departmentId =
                Number(departmentId);

            student.courseId =
                Number(courseId);

            student.semester =
                semester;

            student.admissionYear =
                Number(admissionYear);

            student.address =
                address;
        }


        alert(
            "Student updated successfully!"
        );

    }


    // ==================================================
    // ADD NEW STUDENT
    // ==================================================

    else {

        const newStudent = {

            id: Date.now(),

            name: name,

            roll: roll,

            email: email,

            phone: phone,

            departmentId:
                Number(departmentId),

            courseId:
                Number(courseId),

            semester: semester,

            admissionYear:
                Number(admissionYear),

            address: address,

            createdAt:
                new Date().toISOString()

        };


        students.push(newStudent);


        alert(
            "Student added successfully!"
        );
    }


    saveStudents();

    closeStudentModal();

    displayStudents();

    updateStudentStats();
}


// ======================================================
// DISPLAY STUDENTS
// ======================================================

function displayStudents(
    list = students
) {

    const table =
        document.getElementById(
            "studentTable"
        );

    if (!table) return;


    table.innerHTML = "";


    if (list.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty-message">

                    👨‍🎓 No students found.

                </td>

            </tr>

        `;

        return;
    }


    list.forEach(
        function(student, index) {


            // ------------------------------------------
            // DEPARTMENT
            // ------------------------------------------

            const department =
                departments.find(
                    function(item) {

                        return String(
                            item.id
                        ) ===
                        String(
                            student.departmentId
                        );

                    }
                );


            // ------------------------------------------
            // COURSE
            // ------------------------------------------

            const course =
                courses.find(
                    function(item) {

                        return String(
                            item.id
                        ) ===
                        String(
                            student.courseId
                        );

                    }
                );


            // ------------------------------------------
            // ATTENDANCE
            // ------------------------------------------

            const records =
                attendance.filter(
                    function(item) {

                        return String(
                            item.studentId
                        ) ===
                        String(
                            student.id
                        );

                    }
                );


            const total =
                records.length;


            const present =
                records.filter(
                    function(item) {

                        return item.status ===
                            "Present";

                    }
                ).length;


            const percentage =
                total === 0
                    ? 0
                    : (
                        present /
                        total *
                        100
                    ).toFixed(1);


            // ------------------------------------------
            // ATTENDANCE CLASS
            // ------------------------------------------

            let attendanceClass =
                "attendance-good";


            if (percentage < 75) {

                attendanceClass =
                    "attendance-low";

            }


            // ------------------------------------------
            // TABLE ROW
            // ------------------------------------------

            table.innerHTML += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>


                    <td>

                        <div
                            class="student-name-cell">

                            <div
                                class="student-avatar">

                                ${getInitials(
                                    student.name
                                )}

                            </div>


                            <div>

                                <strong>

                                    ${escapeHTML(
                                        student.name
                                    )}

                                </strong>

                                <small>

                                    ${escapeHTML(
                                        student.email ||
                                        "No email"
                                    )}

                                </small>

                            </div>

                        </div>

                    </td>


                    <td>

                        <span
                            class="code-badge">

                            ${escapeHTML(
                                student.roll
                            )}

                        </span>

                    </td>


                    <td>

                        ${
                            department
                                ? escapeHTML(
                                    department.name
                                )
                                : "Unknown"
                        }

                    </td>


                    <td>

                        ${
                            course
                                ? escapeHTML(
                                    course.name
                                )
                                : "Unknown"
                        }

                    </td>


                    <td>

                        ${escapeHTML(
                            student.semester
                        )}

                    </td>


                    <td>

                        <span
                            class="${attendanceClass}">

                            ${percentage}%

                        </span>

                    </td>


                    <td>

                        <div
                            class="action-buttons">


                            <button
                                class="view-btn"
                                onclick="viewStudent(${student.id})"
                                title="View Profile">

                                👁️

                            </button>


                            <button
                                class="edit-btn"
                                onclick="editStudent(${student.id})"
                                title="Edit">

                                ✏️

                            </button>


                            <button
                                class="delete-btn"
                                onclick="deleteStudent(${student.id})"
                                title="Delete">

                                🗑️

                            </button>

                        </div>

                    </td>

                </tr>

            `;
        }
    );


    updateStudentStats();
}


// ======================================================
// UPDATE STUDENT STATISTICS
// ======================================================

function updateStudentStats() {

    const studentCount =
        document.getElementById(
            "studentCount"
        );


    const departmentCount =
        document.getElementById(
            "studentDepartmentCount"
        );


    const courseCount =
        document.getElementById(
            "studentCourseCount"
        );


    const averageElement =
        document.getElementById(
            "studentAverageAttendance"
        );


    if (studentCount) {

        studentCount.textContent =
            students.length;

    }


    if (departmentCount) {

        departmentCount.textContent =
            departments.length;

    }


    if (courseCount) {

        courseCount.textContent =
            courses.length;

    }


    // ------------------------------------------
    // OVERALL AVERAGE
    // ------------------------------------------

    let totalRecords =
        attendance.length;


    let totalPresent =
        attendance.filter(
            function(item) {

                return item.status ===
                    "Present";

            }
        ).length;


    let average =
        totalRecords === 0
            ? 0
            : (
                totalPresent /
                totalRecords *
                100
            ).toFixed(1);


    if (averageElement) {

        averageElement.textContent =
            average + "%";

    }
}


// ======================================================
// SEARCH STUDENTS
// ======================================================

function searchStudents() {

    filterStudents();
}


// ======================================================
// FILTER STUDENTS
// ======================================================

function filterStudents() {

    const keyword =
        document.getElementById(
            "studentSearch"
        ).value
        .trim()
        .toLowerCase();


    const departmentId =
        document.getElementById(
            "studentDepartmentFilter"
        ).value;


    const courseId =
        document.getElementById(
            "studentCourseFilter"
        ).value;


    const semester =
        document.getElementById(
            "studentSemesterFilter"
        ).value;


    const filtered =
        students.filter(
            function(student) {


                const matchesSearch =

                    student.name
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    student.roll
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    (
                        student.email ||
                        ""
                    )
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    (
                        student.phone ||
                        ""
                    )
                    .toLowerCase()
                    .includes(keyword);


                const matchesDepartment =

                    departmentId === "" ||

                    String(
                        student.departmentId
                    ) ===
                    String(
                        departmentId
                    );


                const matchesCourse =

                    courseId === "" ||

                    String(
                        student.courseId
                    ) ===
                    String(
                        courseId
                    );


                const matchesSemester =

                    semester === "" ||

                    student.semester ===
                    semester;


                return (

                    matchesSearch &&

                    matchesDepartment &&

                    matchesCourse &&

                    matchesSemester

                );

            }
        );


    displayStudents(filtered);
}


// ======================================================
// LOAD DEPARTMENT FILTER
// ======================================================

function loadStudentDepartmentFilter() {

    const select =
        document.getElementById(
            "studentDepartmentFilter"
        );


    if (!select) return;


    select.innerHTML = `

        <option value="">
            All Departments
        </option>

    `;


    departments.forEach(
        function(department) {

            select.innerHTML += `

                <option
                    value="${department.id}">

                    ${escapeHTML(
                        department.name
                    )}

                </option>

            `;

        }
    );
}


// ======================================================
// LOAD COURSE FILTER
// ======================================================

function loadStudentCourseFilter() {

    const select =
        document.getElementById(
            "studentCourseFilter"
        );


    if (!select) return;


    select.innerHTML = `

        <option value="">
            All Courses
        </option>

    `;


    courses.forEach(
        function(course) {

            select.innerHTML += `

                <option
                    value="${course.id}">

                    ${escapeHTML(
                        course.name
                    )}

                </option>

            `;

        }
    );
}


// ======================================================
// EDIT STUDENT
// ======================================================

function editStudent(id) {

    const student =
        students.find(
            function(item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!student) {

        alert(
            "Student not found."
        );

        return;
    }


    document.getElementById(
        "studentModalTitle"
    ).textContent =
        "Edit Student";


    document.getElementById(
        "editStudentId"
    ).value =
        student.id;


    document.getElementById(
        "studentName"
    ).value =
        student.name;


    document.getElementById(
        "studentRoll"
    ).value =
        student.roll;


    document.getElementById(
        "studentEmail"
    ).value =
        student.email || "";


    document.getElementById(
        "studentPhone"
    ).value =
        student.phone || "";


    document.getElementById(
        "studentSemester"
    ).value =
        student.semester || "";


    document.getElementById(
        "studentAdmissionYear"
    ).value =
        student.admissionYear || "";


    document.getElementById(
        "studentAddress"
    ).value =
        student.address || "";


    loadStudentDepartments(
        student.departmentId
    );


    loadStudentCourses(
        student.courseId
    );


    document.getElementById(
        "studentModal"
    ).classList.add("show");
}


// ======================================================
// DELETE STUDENT
// ======================================================

function deleteStudent(id) {

    const student =
        students.find(
            function(item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!student) return;


    const confirmed =
        confirm(

            "Are you sure you want to delete " +
            student.name +
            "?\n\n" +
            "This will also remove the student's attendance records."

        );


    if (!confirmed) return;


    students =
        students.filter(
            function(item) {

                return String(item.id) !==
                    String(id);

            }
        );


    // Remove attendance records

    attendance =
        attendance.filter(
            function(item) {

                return String(
                    item.studentId
                ) !==
                String(id);

            }
        );


    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );


    saveStudents();

    displayStudents();

    updateStudentStats();


    alert(
        "Student deleted successfully."
    );
}


// ======================================================
// VIEW FULL STUDENT PROFILE
// ======================================================

function viewStudent(id) {

    const student =
        students.find(
            function(item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!student) return;


    const department =
        departments.find(
            function(item) {

                return String(item.id) ===
                    String(student.departmentId);

            }
        );


    const course =
        courses.find(
            function(item) {

                return String(item.id) ===
                    String(student.courseId);

            }
        );


    // ------------------------------------------
    // ATTENDANCE
    // ------------------------------------------

    const records =
        attendance.filter(
            function(item) {

                return String(
                    item.studentId
                ) ===
                String(student.id);

            }
        );


    const total =
        records.length;


    const present =
        records.filter(
            function(item) {

                return item.status ===
                    "Present";

            }
        ).length;


    const absent =
        records.filter(
            function(item) {

                return item.status ===
                    "Absent";

            }
        ).length;


    const percentage =
        total === 0
            ? 0
            : (
                present /
                total *
                100
            ).toFixed(1);


    // ------------------------------------------
    // PROFILE HTML
    // ------------------------------------------

    const content =
        document.getElementById(
            "studentProfileContent"
        );


    content.innerHTML = `

        <div class="profile-header">

            <div class="profile-avatar">

                ${getInitials(
                    student.name
                )}

            </div>


            <div>

                <h2>

                    ${escapeHTML(
                        student.name
                    )}

                </h2>


                <p>

                    Roll No:
                    <strong>
                        ${escapeHTML(
                            student.roll
                        )}
                    </strong>

                </p>

            </div>

        </div>



        <div class="profile-stats">


            <div>

                <strong>
                    ${total}
                </strong>

                <span>
                    Total Classes
                </span>

            </div>


            <div>

                <strong>
                    ${present}
                </strong>

                <span>
                    Present
                </span>

            </div>


            <div>

                <strong>
                    ${absent}
                </strong>

                <span>
                    Absent
                </span>

            </div>


            <div>

                <strong>
                    ${percentage}%
                </strong>

                <span>
                    Attendance
                </span>

            </div>

        </div>



        <div class="profile-grid">


            <div class="profile-info-card">

                <h3>
                    🎓 Academic Information
                </h3>


                <p>
                    <strong>Department:</strong>
                    ${
                        department
                            ? escapeHTML(
                                department.name
                            )
                            : "Not available"
                    }
                </p>


                <p>
                    <strong>Course:</strong>
                    ${
                        course
                            ? escapeHTML(
                                course.name
                            )
                            : "Not available"
                    }
                </p>


                <p>
                    <strong>Semester:</strong>
                    ${escapeHTML(
                        student.semester
                    )}
                </p>


                <p>
                    <strong>Admission Year:</strong>
                    ${student.admissionYear}
                </p>

            </div>



            <div class="profile-info-card">

                <h3>
                    📞 Contact Information
                </h3>


                <p>
                    <strong>Email:</strong>
                    ${
                        escapeHTML(
                            student.email ||
                            "Not available"
                        )
                    }
                </p>


                <p>
                    <strong>Phone:</strong>
                    ${
                        escapeHTML(
                            student.phone ||
                            "Not available"
                        )
                    }
                </p>


                <p>
                    <strong>Address:</strong>
                    ${
                        escapeHTML(
                            student.address ||
                            "Not available"
                        )
                    }
                </p>

            </div>

        </div>



        <div class="profile-info-card">

            <h3>
                📅 Attendance History
            </h3>


            ${
                records.length === 0

                ?

                `
                <p class="empty-message">
                    No attendance records available.
                </p>
                `

                :

                `

                <div class="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Subject
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${createAttendanceHistory(
                                records
                            )}

                        </tbody>

                    </table>

                </div>

                `
            }

        </div>

    `;


    document.getElementById(
        "studentProfileModal"
    ).classList.add("show");
}


// ======================================================
// CREATE ATTENDANCE HISTORY
// ======================================================

function createAttendanceHistory(
    records
) {

    return records
        .slice()
        .reverse()
        .map(
            function(record) {

                return `

                    <tr>

                        <td>
                            ${record.date}
                        </td>

                        <td>
                            ${
                                getSubjectName(
                                    record.subjectId
                                )
                            }
                        </td>

                        <td>

                            ${
                                record.status ===
                                "Present"

                                ?

                                `<span class="present-text">
                                    Present
                                </span>`

                                :

                                `<span class="absent-text">
                                    Absent
                                </span>`
                            }

                        </td>

                    </tr>

                `;

            }
        )
        .join("");
}


// ======================================================
// SUBJECT NAME
// ======================================================

function getSubjectName(id) {

    const subjects =
        JSON.parse(
            localStorage.getItem("subjects")
        ) || [];


    const subject =
        subjects.find(
            function(item) {

                return String(item.id) ===
                    String(id);

            }
        );


    return subject
        ? escapeHTML(subject.name)
        : "Unknown Subject";
}


// ======================================================
// CLOSE PROFILE
// ======================================================

function closeStudentProfile() {

    document.getElementById(
        "studentProfileModal"
    ).classList.remove("show");
}


// ======================================================
// GET INITIALS
// ======================================================

function getInitials(name) {

    if (!name) return "ST";


    const words =
        name.trim().split(/\s+/);


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (

        words[0][0] +

        words[
            words.length - 1
        ][0]

    ).toUpperCase();
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
// CLOSE MODALS WHEN CLICKING OUTSIDE
// ======================================================

window.addEventListener(
    "click",
    function(event) {

        const studentModal =
            document.getElementById(
                "studentModal"
            );


        const profileModal =
            document.getElementById(
                "studentProfileModal"
            );


        if (
            event.target ===
            studentModal
        ) {

            closeStudentModal();

        }


        if (
            event.target ===
            profileModal
        ) {

            closeStudentProfile();

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

            closeStudentModal();

            closeStudentProfile();

        }

    }
);


// ======================================================
// INITIALIZE PAGE
// ======================================================

displayCurrentDate();

loadStudentDepartments();

loadStudentDepartmentFilter();

loadStudentCourseFilter();

displayStudents();

updateStudentStats();