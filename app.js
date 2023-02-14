"use strict";


let toDolist = [];

if (localStorage.getItem("toDoList") !== null) {
    toDolist = JSON.parse(localStorage.getItem("toDoList"));
}

// HTML Variables
const textBox = document.getElementById("textBox");
const addButton = document.getElementById("addButton");
const list = document.getElementById("list");
const allDelete = document.getElementById("allTaskDelete");
const filters = document.querySelectorAll(".filters span");
const activeFilter = document.querySelector(".filters span.active");
let editId;
let isEditMode = false;
let editIndex;
displayTask(activeFilter.id);

// event's
addButton.addEventListener("click", addTask);
allDelete.addEventListener("click", deleteAll);

// Displaying the elements in the list
function displayTask(filter) {

    if (toDolist.length == 0) {
        list.innerHTML = "";
        let warning = `
        <li class="list-group-item">
            Task List is empty
        </li>
        `;
        list.insertAdjacentHTML("beforeend", warning);
    } else {

        list.innerHTML = "";

        for (const task of toDolist) {
            let complated = task.taskStatus == "complated" ? "checked" : "";// checked filters
            // filters
            if (filter == task.taskStatus || filter == "all") {
                    let li = `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div class="form-check">
                        <input type="checkbox" onclick="updateTask(this)" class="form-check-input" name="" id="${task.id}" ${complated}>
                        <span id="text" class="${task.taskStatus} " class="ms-3">${task.taskName}</span>
                    </div>
                    <div class="dropdown">
                            <button class="btn btn-primary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-ellipsis"></i>
                            </button>
                            <ul class="dropdown-menu">
                            <li><a class="dropdown-item" onclick="editTask(${task.id})" href="#"><i class="fas fa-pencil me-2"></i>Düzenle</a></li>
                            <li><a class="dropdown-item" onclick="deleteTask(${task.id})" href="#"><i class="fas fa-trash me-2"></i>Sil</a></li>
                            </ul>
                    </div>
                </li>
                
                `;
                list.insertAdjacentHTML("beforeend", li);
            }
        }
    }
}
// all filter add eventlistener
for (const filter of filters) {
    filter.addEventListener("click", function () {
        document.querySelector("span.active").classList.remove("active");
        filter.classList.add("active");
        displayTask(filter.id);
    });
}
// taskName change
function updateTask(task) {
    let id;
    for (const index in toDolist) {
        if (task.id == toDolist[index].id) {
           id = index;
        }
    }
    if (task.checked) {
        toDolist[id].taskStatus = "complated";
        displayTask(activeFilter.id);
    } else {
        toDolist[id].taskStatus = "pending";
        displayTask(activeFilter.id);
    }
    localStorage.setItem("toDoList", JSON.stringify(toDolist));
}

function editTask(id) {
    editId = id;
    isEditMode = true;
    for (const index in toDolist) {
        if (toDolist[index].id == id) {
            editIndex = index;
        }
    }
    addButton.classList.remove("btn-primary");
    addButton.classList.add("btn-danger");
    addButton.textContent = "Edit"
    textBox.value = toDolist[editIndex].taskName;
    localStorage.setItem("toDoList", JSON.stringify(toDolist));
}

function addTask() {
    if (textBox.value == "") {
        alert("metin girin");
    } else {
        if (isEditMode == true) {
            // true , change
            toDolist[editIndex].taskName = textBox.value;
            isEditMode = false;
            textBox.value = "";
            addButton.classList.remove("btn-danger");
            addButton.classList.add("btn-primary");
            addButton.textContent = "Add"
            displayTask(activeFilter.id);
        } else {
            // false , add
            toDolist.push({
                id: toDolist.length + 1,
                taskName: textBox.value,
                taskStatus: "pending",
            });
            textBox.value = "";
            displayTask(activeFilter.id);
            localStorage.setItem("toDoList", JSON.stringify(toDolist));
        }
    }
}

function deleteAll() {
   toDolist.splice(0,toDolist.length);
    textBox.value = "";
    localStorage.setItem("toDoList", JSON.stringify(toDolist));
    displayTask(activeFilter.id);
}

function deleteTask(id) {
    let taskId;
    for (const index in toDolist) {
        if (toDolist[index].id == id) {
            taskId = index;
        }
    }
    toDolist.splice(taskId, 1);
    textBox.value = "";
    displayTask(activeFilter.id);
    localStorage.setItem("toDoList", JSON.stringify(toDolist));
}
