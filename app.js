const courseListEndpoint = "http://localhost:3000/courseList";
let totalCredits = 0;

const courseListDiv = document.querySelector(".course-list");
const selectedCourseListDiv = document.querySelector(".selected-course-list");
const filterInput = document.querySelector("#search-input");

const selectedCourses = [];

window.addEventListener("load", async function() {
    fetchCourses();
});

filterInput.addEventListener("input", async function () {
    const response = await fetch(courseListEndpoint);
    const courseList = await response.json();
    const filteredCourses = courseList.filter(course => course.courseName.toLowerCase().includes(filterInput.value.toLowerCase()));
    renderCourses(filteredCourses);
});

async function fetchCourses() {
    const response = await fetch(courseListEndpoint);
    const courseList = await response.json();

    renderCourses(courseList);
}

function renderCourses(courseList) {
    courseListDiv.innerHTML = "";
    selectedCourseListDiv.innerHTML = "";

    courseList.forEach((course) => {
        const card = createCourseCard(course);
        courseListDiv.appendChild(card);
    });

    const selectButton = document.getElementById("select-button");
    selectButton.addEventListener("click", () => {
        const confirmationMessage = "You have chosen " + totalCredits + " credits for this semester. You cannot change once you submit. Do you want to confirm?";
        const confirmationResult = confirm(confirmationMessage);
        if (confirmationResult) {
            selectedCourses.forEach((course) => {
                const selectedCard = createSelectedCourseCard(course);
                selectedCourseListDiv.appendChild(selectedCard);
            });
            selectedCourses.length = 0;
            selectButton.disabled = true;
        }
    });
}

function createCourseCard(course) {
    const card = document.createElement("div");
    card.classList.add("course-card");

    if (course.required) {
        card.classList.add("required-course-card");
        var courseType = "Compulsory";
    } else {
        var courseType = "Elective";
    }

    const name = document.createElement("p");
    name.classList.add("course-name");
    name.textContent = course.courseName;

    const description = document.createElement("p");
    description.classList.add("course-description");
    description.textContent = course.courseDescription;

    const credit = document.createElement("p");
    credit.classList.add("course-credit");
    credit.textContent = "Credit: " + course.credit;

    const type = document.createElement("p");
    type.classList.add("course-type");
    type.textContent = "Type: " + courseType;

    card.addEventListener("click", () => {
        if (!selectedCourses.includes(course)) {
            if (totalCredits + course.credit <= 18) {
                selectedCourses.push(course);
                card.classList.add("selected-course-card");
                totalCredits += course.credit;
                document.getElementById("total-credits").textContent = "Total credits: " + totalCredits;
            } else {
                alert("You can only choose up to 18 credits in one semester");
            }
        } else {
            selectedCourses.splice(selectedCourses.indexOf(course), 1);
            card.classList.remove("selected-course-card");
            totalCredits -= course.credit;
            document.getElementById("total-credits").textContent = "Total credits: " + totalCredits;
        }
    });

    card.appendChild(name);
    card.appendChild(description);
    card.appendChild(credit);
    card.appendChild(type);

    return card;
}


function createSelectedCourseCard(course) {
    const card = document.createElement("div");
    card.classList.add("course-card");
    card.classList.add("selected-course-card");

    const name = document.createElement("p");
    name.classList.add("course-name");
    name.textContent = course.courseName;

    const description = document.createElement("p");
    description.classList.add("course-description");
    description.textContent = course.courseDescription;

    if (course.required) {
        card.classList.add("required-course-card");
        var courseType = "Compulsory";
    } else {
        var courseType = "Elective";
    }

    const credit = document.createElement("p");
    credit.classList.add("course-credit");
    credit.textContent = "Credit: " + course.credit;

    const type = document.createElement("p");
    type.classList.add("course-type");
    type.textContent = "Type: " + courseType;


    card.appendChild(name);
    card.appendChild(description);
    card.appendChild(credit);
    card.appendChild(type);

    if (course.courseImage) {
        card.appendChild(image);
    }


    return card;
}


