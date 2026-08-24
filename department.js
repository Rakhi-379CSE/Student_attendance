// ======================================================
// ATTENDANCEPRO
// DEPARTMENT MANAGEMENT
// ======================================================

// ======================================================
// LOAD DATA
// ======================================================

let departments =
    JSON.parse(localStorage.getItem("departments")) || [];

let courses =
    JSON.parse(localStorage.getItem("courses")) || [];

let students =
    JSON.parse(localStorage.getItem("students")) || [];


// ======================================================
// SAVE DEPARTMENTS
// ======================================================

function saveDepartments() {
    localStorage.setItem(
        "departments",
        JSON.stringify(departments)
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
// OPEN DEPARTMENT MODAL
// ======================================================

function openDepartmentModal() {

    const modal =
        document.getElementById("departmentModal");

    const form =
        document.getElementById("departmentForm");

    const editId =
        document.getElementById("editDepartmentId");

    const title =
        document.getElementById("departmentModalTitle");


    if (!modal) {
        alert("Department modal not found!");
        return;
    }


    if (form) {
        form.reset();
    }


    if (editId) {
        editId.value = "";
    }


    if (title) {
        title.textContent = "Add Department";
    }


    modal.classList.add("show");
}


// ======================================================
// CLOSE DEPARTMENT MODAL
// ======================================================

function closeDepartmentModal() {

    const modal =
        document.getElementById("departmentModal");

    if (modal) {
        modal.classList.remove("show");
    }
}


// ======================================================
// SAVE DEPARTMENT
// ======================================================

function saveDepartment(event) {

    event.preventDefault();


    const nameInput =
        document.getElementById("departmentName");

    const codeInput =
        document.getElementById("departmentCode");

    const descriptionInput =
        document.getElementById("departmentDescription");

    const editIdInput =
        document.getElementById("editDepartmentId");


    if (
        !nameInput ||
        !codeInput ||
        !descriptionInput ||
        !editIdInput
    ) {
        alert("Department form fields not found!");
        return;
    }


    const name =
        nameInput.value.trim();

    const code =
        codeInput.value.trim().toUpperCase();

    const description =
        descriptionInput.value.trim();

    const editId =
        editIdInput.value;


    // ==================================================
    // VALIDATION
    // ==================================================

    if (name === "") {

        alert("Please enter department name.");
        nameInput.focus();
        return;

    }


    if (code === "") {

        alert("Please enter department code.");
        codeInput.focus();
        return;

    }


    // ==================================================
    // DUPLICATE CODE CHECK
    // ==================================================

    const duplicate =
        departments.find(function(department) {

            return (
                department.code.toLowerCase() ===
                code.toLowerCase()
                &&
                String(department.id) !==
                String(editId)
            );

        });


    if (duplicate) {

        alert(
            "This department code already exists."
        );

        return;
    }


    // ==================================================
    // EDIT DEPARTMENT
    // ==================================================

    if (editId !== "") {

        const department =
            departments.find(function(item) {

                return String(item.id) ===
                       String(editId);

            });


        if (!department) {

            alert("Department not found.");
            return;

        }


        department.name =
            name;

        department.code =
            code;

        department.description =
            description;


        alert(
            "Department updated successfully!"
        );

    }


    // ==================================================
    // ADD DEPARTMENT
    // ==================================================

    else {

        const newDepartment = {

            id: Date.now(),

            name: name,

            code: code,

            description: description,

            createdAt:
                new Date().toISOString()

        };


        departments.push(newDepartment);


        alert(
            "Department added successfully!"
        );

    }


    // SAVE

    saveDepartments();


    // CLOSE

    closeDepartmentModal();


    // REFRESH

    displayDepartments();

    updateDepartmentStats();

}


// ======================================================
// DISPLAY DEPARTMENTS
// ======================================================

function displayDepartments(list = departments) {

    const table =
        document.getElementById("departmentTable");


    if (!table) return;


    table.innerHTML = "";


    // ==================================================
    // EMPTY
    // ==================================================

    if (list.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-message">

                    🏢 No departments found.

                </td>

            </tr>

        `;

        updateDepartmentStats();

        return;
    }


    // ==================================================
    // DISPLAY ROWS
    // ==================================================

    list.forEach(function(department, index) {


        const departmentCourses =
            courses.filter(function(course) {

                return String(course.departmentId) ===
                       String(department.id);

            });


        const departmentStudents =
            students.filter(function(student) {

                return String(student.departmentId) ===
                       String(department.id);

            });


        table.innerHTML += `

            <tr>

                <td>
                    ${index + 1}
                </td>


                <td>

                    <div class="student-name-cell">

                        <div class="student-avatar">

                            ${getInitials(department.name)}

                        </div>


                        <div>

                            <strong>
                                ${escapeHTML(department.name)}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    department.description ||
                                    "Academic Department"
                                )}
                            </small>

                        </div>

                    </div>

                </td>


                <td>

                    <span class="code-badge">

                        ${escapeHTML(department.code)}

                    </span>

                </td>


                <td>

                    <strong>
                        ${departmentCourses.length}
                    </strong>

                </td>


                <td>

                    <strong>
                        ${departmentStudents.length}
                    </strong>

                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            type="button"
                            class="view-btn"
                            onclick="viewDepartment(${department.id})">

                            👁️

                        </button>


                        <button
                            type="button"
                            class="edit-btn"
                            onclick="editDepartment(${department.id})">

                            ✏️

                        </button>


                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deleteDepartment(${department.id})">

                            🗑️

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });


    updateDepartmentStats();

}


// ======================================================
// UPDATE STATISTICS
// ======================================================

function updateDepartmentStats() {

    const departmentCount =
        document.getElementById("departmentCount");

    const courseCount =
        document.getElementById("departmentCourseCount");

    const studentCount =
        document.getElementById("departmentStudentCount");


    if (departmentCount) {

        departmentCount.textContent =
            departments.length;

    }


    if (courseCount) {

        courseCount.textContent =
            courses.length;

    }


    if (studentCount) {

        studentCount.textContent =
            students.length;

    }

}


// ======================================================
// SEARCH DEPARTMENTS
// ======================================================

function searchDepartments() {

    const input =
        document.getElementById("departmentSearch");


    if (!input) return;


    const keyword =
        input.value.trim().toLowerCase();


    const filtered =
        departments.filter(function(department) {

            const name =
                (department.name || "").toLowerCase();

            const code =
                (department.code || "").toLowerCase();

            const description =
                (department.description || "").toLowerCase();


            return (
                name.includes(keyword) ||
                code.includes(keyword) ||
                description.includes(keyword)
            );

        });


    displayDepartments(filtered);

}


// ======================================================
// EDIT DEPARTMENT
// ======================================================

function editDepartment(id) {

    const department =
        departments.find(function(item) {

            return String(item.id) ===
                   String(id);

        });


    if (!department) {

        alert("Department not found.");
        return;

    }


    document.getElementById("departmentName").value =
        department.name;

    document.getElementById("departmentCode").value =
        department.code;

    document.getElementById("departmentDescription").value =
        department.description || "";

    document.getElementById("editDepartmentId").value =
        department.id;

    document.getElementById("departmentModalTitle").textContent =
        "Edit Department";


    document.getElementById("departmentModal")
        .classList.add("show");

}


// ======================================================
// DELETE DEPARTMENT
// ======================================================

function deleteDepartment(id) {

    const department =
        departments.find(function(item) {

            return String(item.id) ===
                   String(id);

        });


    if (!department) return;


    const relatedCourses =
        courses.filter(function(course) {

            return String(course.departmentId) ===
                   String(id);

        });


    const relatedStudents =
        students.filter(function(student) {

            return String(student.departmentId) ===
                   String(id);

        });


    if (
        relatedCourses.length > 0 ||
        relatedStudents.length > 0
    ) {

        alert(
            "This department cannot be deleted.\n\n" +
            "Courses: " +
            relatedCourses.length +
            "\nStudents: " +
            relatedStudents.length +
            "\n\nPlease reassign them first."
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete " +
            department.name +
            "?"
        );


    if (!confirmed) return;


    departments =
        departments.filter(function(item) {

            return String(item.id) !==
                   String(id);

        });


    saveDepartments();

    displayDepartments();

    updateDepartmentStats();


    alert(
        "Department deleted successfully."
    );

}


// ======================================================
// VIEW DEPARTMENT
// ======================================================

function viewDepartment(id) {

    const department =
        departments.find(function(item) {

            return String(item.id) ===
                   String(id);

        });


    if (!department) return;


    const departmentCourses =
        courses.filter(function(course) {

            return String(course.departmentId) ===
                   String(id);

        });


    const departmentStudents =
        students.filter(function(student) {

            return String(student.departmentId) ===
                   String(id);

        });


    let courseText =
        "No courses assigned.";


    if (departmentCourses.length > 0) {

        courseText =
            departmentCourses
                .map(function(course) {

                    return "• " +
                        (course.name || "Unnamed Course");

                })
                .join("\n");

    }


    alert(

        "🏢 DEPARTMENT PROFILE\n\n" +

        "Department: " +
        department.name +

        "\nCode: " +
        department.code +

        "\n\n🎓 Courses: " +
        departmentCourses.length +

        "\n👨‍🎓 Students: " +
        departmentStudents.length +

        "\n\nCOURSES\n" +

        courseText

    );

}


// ======================================================
// GET INITIALS
// ======================================================

function getInitials(name) {

    if (!name) return "DP";


    const words =
        name.trim().split(/\s+/);


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value == null ? "" : String(value);

    return div.innerHTML;

}


// ======================================================
// CLOSE MODAL WHEN CLICK OUTSIDE
// ======================================================

window.addEventListener("click", function(event) {

    const modal =
        document.getElementById("departmentModal");


    if (
        modal &&
        event.target === modal
    ) {

        closeDepartmentModal();

    }

});


// ======================================================
// ESC KEY
// ======================================================

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeDepartmentModal();

    }

});


// ======================================================
// INITIALIZE PAGE
// ======================================================

document.addEventListener("DOMContentLoaded", function() {

    displayCurrentDate();

    displayDepartments();

    updateDepartmentStats();

});