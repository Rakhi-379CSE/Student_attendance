// ======================================================
// ATTENDANCEPRO
// COURSE MANAGEMENT
// ======================================================


// ======================================================
// LOAD DATA
// ======================================================

let courses =
    JSON.parse(
        localStorage.getItem("courses")
    ) || [];


let departments =
    JSON.parse(
        localStorage.getItem("departments")
    ) || [];


let students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [];


// ======================================================
// SAVE COURSES
// ======================================================

function saveCourses() {

    localStorage.setItem(
        "courses",
        JSON.stringify(courses)
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


    if (!element) {
        return;
    }


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
// OPEN MODAL
// ======================================================

function openCourseModal() {

    const modal =
        document.getElementById(
            "courseModal"
        );


    document.getElementById(
        "courseForm"
    ).reset();


    document.getElementById(
        "editCourseId"
    ).value = "";


    document.getElementById(
        "courseModalTitle"
    ).textContent =
        "Add Course";


    loadDepartmentDropdown();


    modal.classList.add(
        "show"
    );

}


// ======================================================
// CLOSE MODAL
// ======================================================

function closeCourseModal() {

    const modal =
        document.getElementById(
            "courseModal"
        );


    modal.classList.remove(
        "show"
    );

}


// ======================================================
// LOAD DEPARTMENT DROPDOWN
// ======================================================

function loadDepartmentDropdown(
    selectedId = ""
) {

    const select =
        document.getElementById(
            "courseDepartment"
        );


    if (!select) {
        return;
    }


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
                String(
                    department.id
                ) ===
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
// SAVE COURSE
// ======================================================

function saveCourse(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "courseName"
        ).value.trim();


    const code =
        document.getElementById(
            "courseCode"
        ).value
        .trim()
        .toUpperCase();


    const departmentId =
        document.getElementById(
            "courseDepartment"
        ).value;


    const duration =
        document.getElementById(
            "courseDuration"
        ).value;


    const description =
        document.getElementById(
            "courseDescription"
        ).value.trim();


    const editId =
        document.getElementById(
            "editCourseId"
        ).value;


    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (name === "") {

        alert(
            "Please enter course name."
        );

        return;
    }


    if (code === "") {

        alert(
            "Please enter course code."
        );

        return;
    }


    if (departmentId === "") {

        alert(
            "Please select a department."
        );

        return;
    }


    // --------------------------------------------------
    // DUPLICATE CODE
    // --------------------------------------------------

    const duplicate =
        courses.find(
            function(course) {

                return (

                    course.code
                        .toLowerCase() ===
                    code.toLowerCase()

                    &&

                    String(
                        course.id
                    ) !==
                    String(editId)

                );

            }
        );


    if (duplicate) {

        alert(
            "This course code already exists."
        );

        return;
    }


    // --------------------------------------------------
    // EDIT COURSE
    // --------------------------------------------------

    if (editId !== "") {

        const course =
            courses.find(
                function(item) {

                    return String(
                        item.id
                    ) ===
                    String(editId);

                }
            );


        if (course) {

            course.name =
                name;

            course.code =
                code;

            course.departmentId =
                Number(
                    departmentId
                );

            course.duration =
                duration;

            course.description =
                description;

        }


        alert(
            "Course updated successfully!"
        );

    }


    // --------------------------------------------------
    // ADD COURSE
    // --------------------------------------------------

    else {

        const newCourse = {

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

            duration:
                duration,

            description:
                description,

            createdAt:
                new Date().toISOString()

        };


        courses.push(
            newCourse
        );


        alert(
            "Course added successfully!"
        );

    }


    saveCourses();

    closeCourseModal();

    displayCourses();

}


// ======================================================
// DISPLAY COURSES
// ======================================================

function displayCourses(
    list = courses
) {

    const table =
        document.getElementById(
            "courseTable"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    if (list.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-message">

                    🎓 No courses found.

                </td>

            </tr>

        `;


        updateCourseStats();

        return;
    }


    list.forEach(
        function(course, index) {


            // ------------------------------------------
            // FIND DEPARTMENT
            // ------------------------------------------

            const department =
                departments.find(
                    function(item) {

                        return String(
                            item.id
                        ) ===
                        String(
                            course.departmentId
                        );

                    }
                );


            // ------------------------------------------
            // FIND STUDENTS
            // ------------------------------------------

            const courseStudents =
                students.filter(
                    function(student) {

                        return String(
                            student.courseId
                        ) ===
                        String(
                            course.id
                        );

                    }
                );


            // ------------------------------------------
            // ROW
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
                                    course.name
                                )}

                            </div>


                            <div>

                                <strong>

                                    ${escapeHTML(
                                        course.name
                                    )}

                                </strong>


                                <small>

                                    ${escapeHTML(
                                        course.description ||
                                        "Academic Course"
                                    )}

                                </small>

                            </div>

                        </div>

                    </td>


                    <td>

                        <span
                            class="code-badge">

                            ${escapeHTML(
                                course.code
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
                            course.duration ||
                            "—"
                        }

                    </td>


                    <td>

                        <strong>
                            ${courseStudents.length}
                        </strong>

                    </td>


                    <td>

                        <div
                            class="action-buttons">


                            <button
                                class="view-btn"
                                onclick="viewCourse(${course.id})"
                                title="View">

                                👁️

                            </button>


                            <button
                                class="edit-btn"
                                onclick="editCourse(${course.id})"
                                title="Edit">

                                ✏️

                            </button>


                            <button
                                class="delete-btn"
                                onclick="deleteCourse(${course.id})"
                                title="Delete">

                                🗑️

                            </button>


                        </div>

                    </td>

                </tr>

            `;

        }
    );


    updateCourseStats();

}


// ======================================================
// UPDATE STATISTICS
// ======================================================

function updateCourseStats() {

    const courseCount =
        document.getElementById(
            "courseCount"
        );


    const departmentCount =
        document.getElementById(
            "courseDepartmentCount"
        );


    const studentCount =
        document.getElementById(
            "courseStudentCount"
        );


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
// SEARCH COURSES
// ======================================================

function searchCourses() {

    const input =
        document.getElementById(
            "courseSearch"
        );


    const keyword =
        input.value
            .trim()
            .toLowerCase();


    const filtered =
        courses.filter(
            function(course) {


                const department =
                    departments.find(
                        function(item) {

                            return String(
                                item.id
                            ) ===
                            String(
                                course.departmentId
                            );

                        }
                    );


                const departmentName =
                    department
                        ? department.name
                        : "";


                return (

                    (
                        course.name ||
                        ""
                    )
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    (
                        course.code ||
                        ""
                    )
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    departmentName
                        .toLowerCase()
                        .includes(keyword)

                );

            }
        );


    displayCourses(
        filtered
    );

}


// ======================================================
// FILTER BY DEPARTMENT
// ======================================================

function filterCoursesByDepartment() {

    const departmentId =
        document.getElementById(
            "departmentFilter"
        ).value;


    if (departmentId === "") {

        displayCourses(
            courses
        );

        return;
    }


    const filtered =
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


    displayCourses(
        filtered
    );

}


// ======================================================
// LOAD DEPARTMENT FILTER
// ======================================================

function loadDepartmentFilter() {

    const select =
        document.getElementById(
            "departmentFilter"
        );


    if (!select) {
        return;
    }


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
// EDIT COURSE
// ======================================================

function editCourse(id) {

    const course =
        courses.find(
            function(item) {

                return String(
                    item.id
                ) ===
                String(id);

            }
        );


    if (!course) {

        alert(
            "Course not found."
        );

        return;
    }


    loadDepartmentDropdown(
        course.departmentId
    );


    document.getElementById(
        "courseName"
    ).value =
        course.name;


    document.getElementById(
        "courseCode"
    ).value =
        course.code;


    document.getElementById(
        "courseDuration"
    ).value =
        course.duration || "";


    document.getElementById(
        "courseDescription"
    ).value =
        course.description || "";


    document.getElementById(
        "editCourseId"
    ).value =
        course.id;


    document.getElementById(
        "courseModalTitle"
    ).textContent =
        "Edit Course";


    document.getElementById(
        "courseModal"
    ).classList.add(
        "show"
    );

}


// ======================================================
// DELETE COURSE
// ======================================================

function deleteCourse(id) {

    const course =
        courses.find(
            function(item) {

                return String(
                    item.id
                ) ===
                String(id);

            }
        );


    if (!course) {
        return;
    }


    // ------------------------------------------
    // CHECK STUDENTS
    // ------------------------------------------

    const relatedStudents =
        students.filter(
            function(student) {

                return String(
                    student.courseId
                ) ===
                String(id);

            }
        );


    if (
        relatedStudents.length > 0
    ) {

        alert(

            "This course cannot be deleted.\n\n" +

            "Students assigned: " +
            relatedStudents.length +

            "\n\nPlease reassign the students first."

        );

        return;
    }


    const confirmed =
        confirm(

            "Are you sure you want to delete " +
            course.name +
            "?"

        );


    if (!confirmed) {
        return;
    }


    courses =
        courses.filter(
            function(item) {

                return String(
                    item.id
                ) !==
                String(id);

            }
        );


    saveCourses();

    displayCourses();

    alert(
        "Course deleted successfully."
    );

}


// ======================================================
// VIEW COURSE
// ======================================================

function viewCourse(id) {

    const course =
        courses.find(
            function(item) {

                return String(
                    item.id
                ) ===
                String(id);

            }
        );


    if (!course) {
        return;
    }


    const department =
        departments.find(
            function(item) {

                return String(
                    item.id
                ) ===
                String(
                    course.departmentId
                );

            }
        );


    const courseStudents =
        students.filter(
            function(student) {

                return String(
                    student.courseId
                ) ===
                String(id);

            }
        );


    alert(

        "🎓 COURSE PROFILE\n\n" +

        "Course: " +
        course.name +

        "\nCode: " +
        course.code +

        "\nDepartment: " +
        (
            department
                ? department.name
                : "Unknown"
        ) +

        "\nDuration: " +
        (
            course.duration ||
            "Not specified"
        ) +

        "\nStudents: " +
        courseStudents.length +

        "\n\nDescription:\n" +
        (
            course.description ||
            "No description"
        )

    );

}


// ======================================================
// INITIALS
// ======================================================

function getInitials(name) {

    if (!name) {
        return "CR";
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
// CLOSE MODAL BY OUTSIDE CLICK
// ======================================================

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "courseModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeCourseModal();

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

            closeCourseModal();

        }

    }
);


// ======================================================
// PAGE LOAD
// ======================================================

displayCurrentDate();

loadDepartmentFilter();

loadDepartmentDropdown();

displayCourses();