let todos_container = [
    [],
    [],
    [],
    []
]

if (localStorage.getItem("Todos")) {
    todos_container = JSON.parse(localStorage.getItem("Todos"));
    for (let i = 0; i < todos_container.length; i++) {
        if (i === 0) {
            const new_tasks = document.querySelector(".new_tasks");
            todos_container[i].forEach(todo => {
                const task = document.createElement("div");
                task.classList.add("task");
                task.draggable = true;
                task.id = todo.id;
                task.style.backgroundColor = todo.color;
                task.innerHTML = `<div class="task_content">${todo.task}</div>`;
                task.addEventListener("dragstart", dragStartHandler)
                new_tasks.appendChild(task);
            })
        } else if (i === 1) {
            const in_progress_tasks = document.querySelector(".in_progress_tasks");
            todos_container[i].forEach(todo => {
                const task = document.createElement("div");
                task.classList.add("task");
                task.draggable = true;
                task.id = todo.id;
                task.style.backgroundColor = todo.color;
                task.innerHTML = `<div class="task_content">${todo.task}</div>`;
                task.addEventListener("dragstart", dragStartHandler)
                in_progress_tasks.appendChild(task);
            })
        } else if (i === 2) {
            const completed_task = document.querySelector(".completed_task");
            todos_container[i].forEach(todo => {
                const task = document.createElement("div");
                task.classList.add("task");
                task.draggable = true;
                task.id = todo.id;
                task.style.backgroundColor = todo.color;
                task.innerHTML = `<div class="task_content">${todo.task}</div>`;
                task.addEventListener("dragstart", dragStartHandler)
                completed_task.appendChild(task);
            })
        } else if (i === 3) {
            const deleted_tasks = document.querySelector(".deleted_tasks");
            todos_container[i].forEach(todo => {
                const task = document.createElement("div");
                task.classList.add("task");
                task.draggable = true;
                task.id = todo.id;
                task.style.backgroundColor = todo.color;
                task.innerHTML = `<div class="task_content">${todo.task}</div>`;
                task.addEventListener("dragstart", dragStartHandler)
                deleted_tasks.appendChild(task);
            })
        }
    }
}

const add_button = document.querySelector(".add_button");
const close_button_task = document.querySelector(".close_button_task");
const cancel_button_task = document.querySelector(".cancel_button_task");
const add_button_task = document.querySelector(".add_button_task");
const all_delete_button = document.querySelector(".all_delete_button");
const color_items = document.querySelectorAll(".color_item");
const add_task_input = document.querySelector(".add_task_input");
const selected_color = document.querySelector(".selected_color");
add_task_input.style.borderColor = selected_color.dataset.color;
var task_id_new = "0";

color_items.forEach(color_item => {
    color_item.style.backgroundColor = color_item.dataset.color;
    color_item.addEventListener("click", () => {
        add_task_input.style.borderColor = color_item.dataset.color;
        const selected_color = document.querySelector(".selected_color");
        selected_color.classList.remove("selected_color");
        color_item.classList.add("selected_color");
    })
})


add_button.addEventListener("click", () => {
    document.body.classList.remove("hidden");
    const todo_input = document.querySelector(".add_task_input");
    todo_input.focus();
});

close_button_task.addEventListener("click", () => {
    document.body.classList.add("hidden");
    const alert = document.querySelector(".alert");
    alert.classList.remove("alert_show");
    const todo_input = document.querySelector(".add_task_input");
    todo_input.value = "";
});

cancel_button_task.addEventListener("click", () => {
    document.body.classList.add("hidden");
    const alert = document.querySelector(".alert");
    alert.classList.remove("alert_show");
    const todo_input = document.querySelector(".add_task_input");
    todo_input.value = "";
});

document.body.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        document.body.classList.add("hidden");
        const todo_input = document.querySelector(".add_task_input");
        todo_input.value = "";
    } else if (event.key === "Enter" && document.body.classList.contains("hidden") === false) {
        add_button_task.click();
    }
});


const tasks_wrappers = document.querySelectorAll(".tasks_wrapper");
tasks_wrappers.forEach(task_wrapper => {
    task_wrapper.addEventListener("drop", dropHandler);
    task_wrapper.addEventListener("dragover", dragOverHandler);
})


function dragStartHandler(event) {
    event.dataTransfer.setData("elementID", event.target.id);
    console.log("event start on " , event.target.id , "from " , event.target.parentElement.classList[1]);
    switch (event.target.parentElement.classList[1]) {
        case "new_tasks":
            const newIndex = todos_container[0].findIndex(todo => todo.id === event.target.id);
            if (newIndex !== -1) {
                todos_container[0].splice(newIndex, 1);
            }
            break;
        case "in_progress_tasks":
            const inProgressIndex = todos_container[1].findIndex(todo => todo.id === event.target.id);
            if (inProgressIndex !== -1) {
                todos_container[1].splice(inProgressIndex, 1);
            }
            break;
        case "completed_task":
            const completedIndex = todos_container[2].findIndex(todo => todo.id === event.target.id);
            if (completedIndex !== -1) {
                todos_container[2].splice(completedIndex, 1);
            }
            break;
        case "deleted_tasks":
            const deletedIndex = todos_container[3].findIndex(todo => todo.id === event.target.id);
            if (deletedIndex !== -1) {
                todos_container[3].splice(deletedIndex, 1);
            }
            break;
        default:
            break;
    }
}

function dropHandler(event) {
    const task_id = event.dataTransfer.getData("elementID");
    const task = document.getElementById(task_id);
    console.log("event drop on " , task_id , "to " , event.target.classList[1]);
    switch (event.target.classList[1]) {
        case "new_tasks":
            todos_container[0].push({id:task_id, task:task.firstChild.innerHTML, color:task.style.backgroundColor});
            break;
        case "in_progress_tasks":
            todos_container[1].push({id:task_id, task:task.firstChild.innerHTML, color:task.style.backgroundColor});
            break;
        case "completed_task":
            todos_container[2].push({id:task_id, task:task.firstChild.innerHTML, color:task.style.backgroundColor});
            break;
        case "deleted_tasks":
            todos_container[3].push({id:task_id, task:task.firstChild.innerHTML, color:task.style.backgroundColor});
            break;
        default:
            break;
    }
    console.log(todos_container);
    localStorage.setItem("Todos", JSON.stringify(todos_container));
    event.target.appendChild(task);
}

function dragOverHandler(event) {
    event.preventDefault();
}



add_button_task.addEventListener("click", () => {
    const new_item = {id:"", task:"" , color:""};
    const todo_input = document.querySelector(".add_task_input");
    const todo_title = todo_input.value;
    const new_tasks = document.querySelector(".new_tasks");
    const alert = document.querySelector(".alert");
    if (todo_title.trim() !== "") {
        const task = document.createElement("div");
        task.classList.add("task");
        task.draggable = true;
        task.id = task_id_new;
        new_item.id = task_id_new;
        task_id_new = ((+task_id_new) + 1).toString();
        task.style.backgroundColor = todo_input.style.borderColor;
        task.innerHTML = `<div class="task_content">${todo_title}</div>`;
        task.addEventListener("dragstart", dragStartHandler)
        new_tasks.appendChild(task);
        new_item.task = todo_title;
        new_item.color = todo_input.style.borderColor;
        todos_container[0].push(new_item);
        todo_input.value = "";
        alert.classList.remove("alert_show");
        document.body.classList.add("hidden");
        localStorage.setItem("Todos", JSON.stringify(todos_container));
    } else  {
        alert.classList.add("alert_show");
    }
});

const deleted_tasks = document.querySelector(".deleted_tasks");
all_delete_button.addEventListener("click", () => {
    deleted_tasks.innerHTML = ``;
    todos_container[3] = [];
    localStorage.setItem("Todos", JSON.stringify(todos_container));
    console.log(todos_container);
})


const theme_button = document.querySelector(".theme_button");
const task_wrapper = document.querySelector(".task_wrapper");
const hedder_title = document.querySelector(".hedder");
const theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark";
    if (theme === "light") {
        theme_button.firstChild.src = "./images/night-moon-svgrepo-com.svg";
        document.body.style.backgroundColor = "rgb(214, 214, 214)";
        task_wrapper.style.backgroundColor = "#989898";
        hedder_title.style.color = "#000";
    } else {
        theme_button.firstChild.src = "./images/day-forecast-hot-svgrepo-com.svg";
        document.body.style.backgroundColor = "rgb(7, 22, 36)";
        task_wrapper.style.backgroundColor = "#1b182c";
        hedder_title.style.color = "#fff";
    }

theme_button.addEventListener("click", () => {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
        localStorage.setItem("theme", "dark");
        theme_button.firstChild.src = "./images/day-forecast-hot-svgrepo-com.svg";
        document.body.style.backgroundColor = "rgb(7, 22, 36)";
        task_wrapper.style.backgroundColor = "#1b182c";
        hedder_title.style.color = "#fff";
    } else {
        localStorage.setItem("theme", "light");
        theme_button.firstChild.src = "./images/night-moon-svgrepo-com.svg";
        document.body.style.backgroundColor = "rgb(214, 214, 214)";
        task_wrapper.style.backgroundColor = "#989898";
        hedder_title.style.color = "#000";
    }
})


