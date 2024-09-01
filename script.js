let btn = document.querySelector("#add-btn");
let ol = document.querySelector("#task-list");
let inp = document.querySelector("#task-input");
let searchInput = document.querySelector("#search-input");

// Load tasks from localStorage when the page loads
window.onload = function() {
    let storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    storedTasks.forEach(task => {
        addTaskToDOM(task.text, task.isDone);
    });
};

// Add task event listener
btn.addEventListener("click", function() {
    if (inp.value.trim() !== "") {
        addTaskToDOM(inp.value, false);
        saveTasks();
        inp.value = "";
    }
});

function addTaskToDOM(text, isDone) {
    let item = document.createElement("li");

    // Create Checkbox for marking task as done
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("done-checkbox");
    checkbox.checked = isDone;

    checkbox.addEventListener("change", function() {
        item.classList.toggle("done", checkbox.checked);
        saveTasks();
    });

    // Create Span for the task text
    let taskText = document.createElement("span");
    taskText.textContent = text;
    if (isDone) {
        item.classList.add("done");
    }

    // Create Edit button
    let editbtn = document.createElement("button");
    editbtn.style.backgroundColor = "navyblue";
    editbtn.innerText = "edit";
    editbtn.classList.add("edit");

    editbtn.addEventListener("click", function() {
        let newValue = prompt("Edit item:", text);
        if (newValue !== null && newValue.trim() !== "") {
            taskText.textContent = newValue;
            saveTasks();
        }
    });

    // Create Delete button
    let delbtn = document.createElement("button");
    delbtn.style.backgroundColor = "red";
    delbtn.innerText = "delete";
    delbtn.classList.add("delete");

    delbtn.addEventListener("click", function() {
        item.remove();
        saveTasks();
    });

    //  Up and Down buttons for moving tasks
    let upBtn = document.createElement("button");
    upBtn.innerText = "▲";
    upBtn.classList.add("move-up");
    upBtn.addEventListener("click", function() {
        let prev = item.previousElementSibling;
        if (prev) {
            ol.insertBefore(item, prev);
            saveTasks();
        }
    });

    let downBtn = document.createElement("button");
    downBtn.innerText = "▼";
    downBtn.classList.add("move-down");
    downBtn.addEventListener("click", function() {
        let next = item.nextElementSibling;
        if (next) {
            ol.insertBefore(next, item);
            saveTasks();
        }
    });

    item.appendChild(checkbox);
    item.appendChild(taskText);
    item.appendChild(editbtn);
    item.appendChild(delbtn);
    item.appendChild(upBtn);
    item.appendChild(downBtn);
    ol.appendChild(item);
}

// Search Feature
searchInput.addEventListener("input", function() {
    let filter = searchInput.value.toLowerCase();
    let items = ol.getElementsByTagName("li");

    Array.from(items).forEach(function(item) {
        let text = item.querySelector("span").textContent;
        if (text.toLowerCase().includes(filter)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
});

// Save tasks to localStorage for after refreshing data should not be deleted
function saveTasks() {
    let tasks = [];
    ol.querySelectorAll("li").forEach(item => {
        let taskText = item.querySelector("span").textContent;
        let isDone = item.querySelector('.done-checkbox').checked;
        tasks.push({ text: taskText, isDone: isDone });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
