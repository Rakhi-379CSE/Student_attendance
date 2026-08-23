/* =========================================================
   ATTENDANCEPRO
   PROFESSIONAL DASHBOARD SCRIPT
   ========================================================= */


/* =========================================================
   1. LOAD DATA FROM LOCAL STORAGE
   ========================================================= */

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


/* =========================================================
   2. HELPER FUNCTIONS
   ========================================================= */

/*
   Different pages sometimes save an ID as a number
   and sometimes as a string.

   This function makes ID comparison easier.
*/

function sameId(a, b) {

    return String(a) === String(b);

}


/*
   Find student
*/

function getStudent(studentId) {

    return students.find(function(student) {

        return sameId(student.id, studentId);

    });

}


/*
   Find department
*/

function getDepartment(departmentId) {

    return departments.find(function(department) {

        return sameId(department.id, departmentId);

    });

}


/*
   Find course
*/

function getCourse(courseId) {

    return courses.find(function(course) {

        return sameId(course.id, courseId);

    });

}


/*
   Find subject
*/

function getSubject(subjectId) {

    return subjects.find(function(subject) {

        return sameId(subject.id, subjectId);

    });

}


/* =========================================================
   3. CURRENT DATE
   ========================================================= */

function displayCurrentDate() {

    const dateElement =
        document.getElementById("currentDate");

    if (!dateElement) {
        return;
    }


    const today = new Date();


    const options = {

        weekday: "long",

        year: "numeric",

        month: "long",

        day: "numeric"

    };


    dateElement.textContent =
        today.toLocaleDateString(
            "en-IN",
            options
        );

}


/* =========================================================
   4. TOTAL STUDENTS
   ========================================================= */

function displayTotalStudents() {

    const element =
        document.getElementById("totalStudents");

    if (!element) {
        return;
    }


    element.textContent =
        students.length;

}


/* =========================================================
   5. TOTAL DEPARTMENTS
   ========================================================= */

function displayTotalDepartments() {

    const element =
        document.getElementById(
            "totalDepartments"
        );

    if (!element) {
        return;
    }


    element.textContent =
        departments.length;

}


/* =========================================================
   6. TOTAL COURSES
   ========================================================= */

function displayTotalCourses() {

    const element =
        document.getElementById(
            "totalCourses"
        );

    if (!element) {
        return;
    }


    element.textContent =
        courses.length;

}


/* =========================================================
   7. TOTAL SUBJECTS
   ========================================================= */

function displayTotalSubjects() {

    const element =
        document.getElementById(
            "totalSubjects"
        );

    if (!element) {
        return;
    }


    element.textContent =
        subjects.length;

}


/* =========================================================
   8. AVERAGE ATTENDANCE
   ========================================================= */

function calculateAverageAttendance() {

    const element =
        document.getElementById(
            "averageAttendance"
        );

    if (!element) {
        return;
    }


    if (attendance.length === 0) {

        element.textContent =
            "0%";

        return;
    }


    const presentCount =
        attendance.filter(function(item) {

            return (
                item.status === "Present"
            );

        }).length;


    const average =
        (
            presentCount /
            attendance.length
        ) * 100;


    element.textContent =
        average.toFixed(1) + "%";

}


/* =========================================================
   9. TODAY'S ATTENDANCE
   ========================================================= */

function displayTodayAttendance() {

    const element =
        document.getElementById(
            "todayAttendance"
        );

    if (!element) {
        return;
    }


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayRecords =
        attendance.filter(function(item) {

            return item.date === today;

        });


    element.textContent =
        todayRecords.length;

}


/* =========================================================
   10. LOW ATTENDANCE STUDENTS
   ========================================================= */

function displayLowAttendance() {

    const tbody =
        document.getElementById(
            "lowAttendanceList"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    /*
       Calculate every student's attendance
    */

    const lowStudents = [];


    students.forEach(function(student) {

        const records =
            attendance.filter(function(item) {

                return sameId(
                    item.studentId,
                    student.id
                );

            });


        /*
           No attendance record
        */

        if (records.length === 0) {
            return;
        }


        const present =
            records.filter(function(item) {

                return (
                    item.status === "Present"
                );

            }).length;


        const percentage =
            (
                present /
                records.length
            ) * 100;


        /*
           Below 75%
        */

        if (percentage < 75) {

            lowStudents.push({

                student: student,

                percentage:
                    percentage

            });

        }

    });


    /*
       Sort lowest attendance first
    */

    lowStudents.sort(function(a, b) {

        return (
            a.percentage -
            b.percentage
        );

    });


    /*
       Show maximum 5 students
    */

    const displayStudents =
        lowStudents.slice(0, 5);


    if (displayStudents.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty-message">

                    🎉 No low attendance students

                </td>

            </tr>

        `;

        return;
    }


    displayStudents.forEach(function(item) {

        const student =
            item.student;


        /*
           Support different student
           data structures.
        */

        const roll =
            student.roll ||
            student.rollNumber ||
            student.studentId ||
            "N/A";


        const course =
            getStudentCourseName(
                student
            );


        const percentage =
            item.percentage.toFixed(1);


        tbody.innerHTML += `

            <tr>

                <td>
                    <strong>
                        ${escapeHTML(
                            student.name ||
                            "Unknown"
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        String(roll)
                    )}
                </td>

                <td>
                    ${escapeHTML(course)}
                </td>

                <td>

                    <span
                        class="badge badge-absent">

                        ${percentage}%

                    </span>

                </td>

            </tr>

        `;

    });

}


/* =========================================================
   11. GET STUDENT COURSE NAME
   ========================================================= */

function getStudentCourseName(student) {

    /*
       If course name is directly saved
    */

    if (student.courseName) {

        return student.courseName;

    }


    if (student.course) {

        /*
           If course is an object
        */

        if (
            typeof student.course ===
            "object"
        ) {

            return (
                student.course.name ||
                "N/A"
            );

        }


        /*
           If course is an ID
        */

        const course =
            getCourse(
                student.course
            );


        if (course) {

            return (
                course.name ||
                course.courseName ||
                "N/A"
            );

        }

    }


    if (student.courseId) {

        const course =
            getCourse(
                student.courseId
            );


        if (course) {

            return (
                course.name ||
                course.courseName ||
                "N/A"
            );

        }

    }


    return "N/A";

}


/* =========================================================
   12. RECENT ATTENDANCE
   ========================================================= */

function displayRecentAttendance() {

    const tbody =
        document.getElementById(
            "recentAttendance"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (attendance.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty-message">

                    📅 No attendance records yet

                </td>

            </tr>

        `;

        return;
    }


    /*
       Newest records first
    */

    const recent =
        attendance
            .slice()
            .sort(function(a, b) {

                /*
                   First compare date
                */

                if (a.date !== b.date) {

                    return (
                        new Date(b.date) -
                        new Date(a.date)
                    );

                }


                /*
                   Then compare ID
                */

                return (
                    Number(b.id || 0) -
                    Number(a.id || 0)
                );

            })
            .slice(0, 8);


    recent.forEach(function(item) {

        const student =
            getStudent(
                item.studentId
            );


        const subject =
            getSubject(
                item.subjectId
            );


        /*
           If subject does not exist,
           try subjectId / subjectName
        */

        let subjectName =
            "Unknown";


        if (subject) {

            subjectName =
                subject.name ||
                subject.subjectName ||
                "Unknown";

        }
        else if (item.subjectName) {

            subjectName =
                item.subjectName;

        }


        const studentName =
            student
                ? (
                    student.name ||
                    "Unknown"
                )
                : (
                    item.studentName ||
                    "Unknown"
                );


        const status =
            item.status || "Unknown";


        const statusClass =
            status === "Present"
                ? "badge-present"
                : "badge-absent";


        tbody.innerHTML += `

            <tr>

                <td>
                    ${formatDate(
                        item.date
                    )}
                </td>

                <td>

                    <strong>
                        ${escapeHTML(
                            studentName
                        )}
                    </strong>

                </td>

                <td>
                    ${escapeHTML(
                        subjectName
                    )}
                </td>

                <td>

                    <span
                        class="badge ${statusClass}">

                        ${escapeHTML(
                            status
                        )}

                    </span>

                </td>

            </tr>

        `;

    });

}


/* =========================================================
   13. DATE FORMAT
   ========================================================= */

function formatDate(dateString) {

    if (!dateString) {

        return "N/A";

    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    if (isNaN(date.getTime())) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   14. SECURITY HELPER
   ========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value == null
            ? ""
            : String(value);


    return div.innerHTML;

}


/* =========================================================
   15. REFRESH DASHBOARD
   ========================================================= */

function displayDashboard() {

    /*
       Reload fresh LocalStorage data.
       This is useful when another page
       changes data.
    */

    students =
        JSON.parse(
            localStorage.getItem(
                "students"
            )
        ) || [];


    departments =
        JSON.parse(
            localStorage.getItem(
                "departments"
            )
        ) || [];


    courses =
        JSON.parse(
            localStorage.getItem(
                "courses"
            )
        ) || [];


    subjects =
        JSON.parse(
            localStorage.getItem(
                "subjects"
            )
        ) || [];


    attendance =
        JSON.parse(
            localStorage.getItem(
                "attendance"
            )
        ) || [];


    displayCurrentDate();

    displayTotalStudents();

    displayTotalDepartments();

    displayTotalCourses();

    displayTotalSubjects();

    calculateAverageAttendance();

    displayTodayAttendance();

    displayLowAttendance();

    displayRecentAttendance();

}


/* =========================================================
   16. AUTO REFRESH
   ========================================================= */

displayDashboard();


/*
   Refresh dashboard every 2 seconds.

   Example:
   If you add a student from another tab,
   dashboard can update automatically.
*/

setInterval(function() {

    displayDashboard();

}, 2000);


/* =========================================================
   17. STORAGE EVENT
   ========================================================= */

window.addEventListener(
    "storage",
    function() {

        displayDashboard();

    }
);


/* =========================================================
   END OF SCRIPT
   ========================================================= */