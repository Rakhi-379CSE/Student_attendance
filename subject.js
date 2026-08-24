// ======================================================
// ATTENDANCEPRO
// SUBJECT MANAGEMENT SYSTEM
// ======================================================


// ======================================================
// LOAD DATA
// ======================================================

let subjects =
    JSON.parse(
        localStorage.getItem("subjects")
    ) || [];


let departments =
    JSON.parse(
        localStorage.getItem("departments")
    ) || [];


let courses =
    JSON.parse(
        localStorage.getItem("courses")
    ) || [];


let students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [];


// ======================================================
// SAVE SUBJECTS
// ======================================================

function saveSubjects() {

    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );

}


// ======================================================
// CURRENT DATE
// ======================================================

function displayCurrentDate() {

    const element =
        document.getElementById(
            "currentDate"
        );

    if (!element) return;

    const today =
        new Date();

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
// OPEN SUBJECT MODAL
// ======================================================

function openSubjectModal() {

    const modal =
        document.getElementById(
            "subjectModal"
        );

    const form =
        document.getElementById(
            "subjectForm"
        );

    form.reset();

    document.getElementById(
        "editSubjectId"
    ).value = "";

    document.getElementById(
        "subjectModalTitle"
    ).textContent =
        "Add Subject";

    loadSubjectDepartments();

    document.getElementById(
        "subjectCourse"
    ).innerHTML = `

        <option value="">
            Select Course
        </option>

    `;

    modal.classList.add(
        "show"
    );

}


// ======================================================
// CLOSE SUBJECT MODAL
// ======================================================

function closeSubjectModal() {

    const modal =
        document.getElementById(
            "subjectModal"
        );

    modal.classList.remove(
        "show"
    );

}


// ======================================================
// LOAD DEPARTMENTS
// ======================================================

function loadSubjectDepartments(
    selectedId = ""
) {

    const select =
        document.getElementById(
            "subjectDepartment"
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
                document.createElement(
                    "option"
                );

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

                option.selected =
                    true;

            }

            select.appendChild(
                option
            );

        }
    );

}


// ======================================================
// LOAD COURSES ACCORDING TO DEPARTMENT
// ======================================================

function loadSubjectCourses(
    selectedCourseId = ""
) {

    const departmentId =
        document.getElementById(
            "subjectDepartment"
        ).value;


    const courseSelect =
        document.getElementById(
            "subjectCourse"
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
                document.createElement(
                    "option"
                );

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

                option.selected =
                    true;

            }


            courseSelect.appendChild(
                option
            );

        }
    );

}


// ======================================================
// SAVE SUBJECT
// ======================================================

function saveSubject(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "subjectName"
        ).value.trim();


    const code =
        document.getElementById(
            "subjectCode"
        ).value
        .trim()
        .toUpperCase();


    const departmentId =
        document.getElementById(
            "subjectDepartment"
        ).value;


    const courseId =
        document.getElementById(
            "subjectCourse"
        ).value;


    const semester =
        document.getElementById(
            "subjectSemester"
        ).value;


    const credits =
        document.getElementById(
            "subjectCredits"
        ).value;


    const description =
        document.getElementById(
            "subjectDescription"
        ).value.trim();


    const editId =
        document.getElementById(
            "editSubjectId"
        ).value;


    // ==================================================
    // VALIDATION
    // ==================================================

    if (name === "") {

        alert(
            "Please enter subject name."
        );

        return;
    }


    if (code === "") {

        alert(
            "Please enter subject code."
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


    // ==================================================
    // DUPLICATE SUBJECT CODE
    // ==================================================

    const duplicate =
        subjects.find(
            function(subject) {

                return (

                    subject.code
                        .toLowerCase() ===
                    code.toLowerCase()

                    &&

                    String(subject.id) !==
                    String(editId)

                );

            }
        );


    if (duplicate) {

        alert(
            "This subject code already exists."
        );

        return;
    }


    // ==================================================
    // EDIT SUBJECT
    // ==================================================

    if (editId !== "") {

        const subject =
            subjects.find(
                function(item) {

                    return String(
                        item.id
                    ) ===
                    String(editId);

                }
            );


        if (subject) {

            subject.name =
                name;

            subject.code =
                code;

            subject.departmentId =
                Number(
                    departmentId
                );

            subject.courseId =
                Number(
                    courseId
                );

            subject.semester =
                semester;

            subject.credits =
                credits;

            subject.description =
                description;

        }


        alert(
            "Subject updated successfully!"
        );

    }


    // ==================================================
    // ADD SUBJECT
    // ==================================================

    else {

        const newSubject = {

            id:
                Date.now(),

            name:
                name,

            code:
                code,

            departmentId:
                Number(
                    departmentId
                ),

            courseId:
                Number(
                    courseId
                ),

            semester:
                semester,

            credits:
                credits,

            description:
                description,

            createdAt:
                new Date().toISOString()

        };


        subjects.push(
            newSubject
        );


        alert(
            "Subject added successfully!"
        );

    }


    saveSubjects();

    closeSubjectModal();

    displaySubjects();

    updateSubjectStats();

}


// ======================================================
// DISPLAY SUBJECTS
// ======================================================

function displaySubjects(
    list = subjects
) {

    const table =
        document.getElementById(
            "subjectTable"
        );


    if (!table) return;


    table.innerHTML = "";


    if (list.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-message">

                    📚 No subjects found.

                </td>

            </tr>

        `;


        updateSubjectStats();

        return;
    }


    list.forEach(
        function(subject, index) {


            const department =
                departments.find(
                    function(item) {

                        return String(
                            item.id
                        ) ===
                        String(
                            subject.departmentId
                        );

                    }
                );


            const course =
                courses.find(
                    function(item) {

                        return String(
                            item.id
                        ) ===
                        String(
                            subject.courseId
                        );

                    }
                );


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
                                    subject.name
                                )}

                            </div>


                            <div>

                                <strong>

                                    ${escapeHTML(
                                        subject.name
                                    )}

                                </strong>


                                <small>

                                    ${escapeHTML(
                                        subject.description ||
                                        "Academic Subject"
                                    )}

                                </small>

                            </div>

                        </div>

                    </td>


                    <td>

                        <span
                            class="code-badge">

                            ${escapeHTML(
                                subject.code
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
                            subject.semester
                        )}

                    </td>


                    <td>

                        <div
                            class="action-buttons">


                            <button
                                class="view-btn"
                                onclick="viewSubject(${subject.id})"
                                title="View">

                                👁️

                            </button>


                            <button
                                class="edit-btn"
                                onclick="editSubject(${subject.id})"
                                title="Edit">

                                ✏️

                            </button>


                            <button
                                class="delete-btn"
                                onclick="deleteSubject(${subject.id})"
                                title="Delete">

                                🗑️

                            </button>


                        </div>

                    </td>


                </tr>

            `;

        }
    );


    updateSubjectStats();

}


// ======================================================
// UPDATE STATISTICS
// ======================================================

function updateSubjectStats() {

    const subjectCount =
        document.getElementById(
            "subjectCount"
        );


    const courseCount =
        document.getElementById(
            "subjectCourseCount"
        );


    const departmentCount =
        document.getElementById(
            "subjectDepartmentCount"
        );


    const studentCount =
        document.getElementById(
            "subjectStudentCount"
        );


    if (subjectCount) {

        subjectCount.textContent =
            subjects.length;

    }


    if (courseCount) {

        courseCount.textContent =
            courses.length;

    }


    if (departmentCount) {

        departmentCount.textContent =
            departments.length;

    }


    if (studentCount) {

        studentCount.textContent =
            students.length;

    }

}


// ======================================================
// SEARCH SUBJECTS
// ======================================================

function searchSubjects() {

    filterSubjects();

}


// ======================================================
// FILTER SUBJECTS
// ======================================================

function filterSubjects() {

    const keyword =
        document.getElementById(
            "subjectSearch"
        ).value
        .trim()
        .toLowerCase();


    const departmentId =
        document.getElementById(
            "subjectDepartmentFilter"
        ).value;


    const courseId =
        document.getElementById(
            "subjectCourseFilter"
        ).value;


    const filtered =
        subjects.filter(
            function(subject) {


                const department =
                    departments.find(
                        function(item) {

                            return String(
                                item.id
                            ) ===
                            String(
                                subject.departmentId
                            );

                        }
                    );


                const course =
                    courses.find(
                        function(item) {

                            return String(
                                item.id
                            ) ===
                            String(
                                subject.courseId
                            );

                        }
                    );


                const departmentName =
                    department
                        ? department.name
                        : "";


                const courseName =
                    course
                        ? course.name
                        : "";


                const matchesSearch =

                    (
                        subject.name ||
                        ""
                    )
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    (
                        subject.code ||
                        ""
                    )
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    departmentName
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    courseName
                        .toLowerCase()
                        .includes(keyword);


                const matchesDepartment =

                    departmentId === "" ||

                    String(
                        subject.departmentId
                    ) ===
                    String(
                        departmentId
                    );


                const matchesCourse =

                    courseId === "" ||

                    String(
                        subject.courseId
                    ) ===
                    String(
                        courseId
                    );


                return (

                    matchesSearch &&

                    matchesDepartment &&

                    matchesCourse

                );

            }
        );


    displaySubjects(
        filtered
    );

}


// ======================================================
// LOAD DEPARTMENT FILTER
// ======================================================

function loadSubjectDepartmentFilter() {

    const select =
        document.getElementById(
            "subjectDepartmentFilter"
        );


    if (!select) return;


    select.innerHTML = `

        <option value="">
            All Departments
        </option>

    `;


    departments.forEach(
        function(department) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                department.id;


            option.textContent =
                department.name;


            select.appendChild(
                option
            );

        }
    );

}


// ======================================================
// LOAD COURSE FILTER
// ======================================================

function loadSubjectCourseFilter() {

    const select =
        document.getElementById(
            "subjectCourseFilter"
        );


    if (!select) return;


    const departmentFilter =
        document.getElementById(
            "subjectDepartmentFilter"
        );


    const departmentId =
        departmentFilter
            ? departmentFilter.value
            : "";


    select.innerHTML = `

        <option value="">
            All Courses
        </option>

    `;


    const filteredCourses =

        departmentId === ""

            ? courses

            : courses.filter(
                function(course) {

                    return String(
                        course.departmentId
                    ) ===
                    String(
                        departmentId
                    );

                }
            );


    filteredCourses.forEach(
        function(course) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                course.id;


            option.textContent =
                course.name;


            select.appendChild(
                option
            );

        }
    );

}


// ======================================================
// EDIT SUBJECT
// ======================================================

function editSubject(id) {

    const subject =
        subjects.find(
            function(item) {

                return String(
                    item.id
                ) ===
                String(id);

            }
        );


    if (!subject) {

        alert(
            "Subject not found."
        );

        return;
    }


    document.getElementById(
        "subjectModalTitle"
    ).textContent =
        "Edit Subject";


    document.getElementById(
        "editSubjectId"
    ).value =
        subject.id;


    document.getElementById(
        "subjectName"
    ).value =
        subject.name;


    document.getElementById(
        "subjectCode"
    ).value =
        subject.code;


    document.getElementById(
        "subjectSemester"
    ).value =
        subject.semester || "";


    document.getElementById(
        "subjectCredits"
    ).value =
        subject.credits || "";


    document.getElementById(
        "subjectDescription"
    ).value =
        subject.description || "";


    loadSubjectDepartments(
        subject.departmentId
    );


    loadSubjectCourses(
        subject.courseId
    );


    document.getElementById(
        "subjectModal"
    ).classList.add(
        "show"
    );

}


// ======================================================
// DELETE SUBJECT
// ======================================================

function deleteSubject(id) {

    const subject =
        subjects.find(
            function(item) {

                return String(
                    item.id
                ) ===
                String(id);

            }
        );


    if (!subject) {
        return;
    }


    const confirmed =
        confirm(

            "Are you sure you want to delete " +
            subject.name +
            "?"

        );


    if (!confirmed) {
        return;
    }


    subjects =
        subjects.filter(
            function(item) {

                return String(
                    item.id
                ) !==
                String(id);

            }
        );


    saveSubjects();

    displaySubjects();

    updateSubjectStats();


    alert(
        "Subject deleted successfully."
    );

}


// ======================================================
// VIEW SUBJECT
// ======================================================

function viewSubject(id) {

    const subject =
        subjects.find(
            function(item) {

                return String(
                    item.id
                ) ===
                String(id);

            }
        );


    if (!subject) {
        return;
    }


    const department =
        departments.find(
            function(item) {

                return String(
                    item.id
                ) ===
                String(
                    subject.departmentId
                );

            }
        );


    const course =
        courses.find(
            function(item) {

                return String(
                    item.id
                ) ===
                String(
                    subject.courseId
                );

            }
        );


    alert(

        "📚 SUBJECT PROFILE\n\n" +

        "Subject: " +
        subject.name +

        "\nCode: " +
        subject.code +

        "\nDepartment: " +
        (
            department
                ? department.name
                : "Unknown"
        ) +

        "\nCourse: " +
        (
            course
                ? course.name
                : "Unknown"
        ) +

        "\nSemester: " +
        (
            subject.semester ||
            "Not specified"
        ) +

        "\nCredits: " +
        (
            subject.credits ||
            "Not specified"
        ) +

        "\n\nDescription:\n" +

        (
            subject.description ||
            "No description"
        )

    );

}


// ======================================================
// GET INITIALS
// ======================================================

function getInitials(name) {

    if (!name) {
        return "SB";
    }


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
        document.createElement(
            "div"
        );


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
                "subjectModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeSubjectModal();

        }

    }
);


// ======================================================
// ESCAPE KEY
// ======================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeSubjectModal();

        }

    }
);


// ======================================================
// PAGE INITIALIZATION
// ======================================================

displayCurrentDate();

loadSubjectDepartments();

loadSubjectDepartmentFilter();

loadSubjectCourseFilter();

displaySubjects();

updateSubjectStats();