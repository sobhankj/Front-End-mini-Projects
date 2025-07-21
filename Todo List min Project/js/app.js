const add_button = document.querySelector(".add_button");
const close_button_task = document.querySelector(".close_button_task");
const cancel_button_task = document.querySelector(".cancel_button_task");
const add_button_task = document.querySelector(".add_button_task");
const all_delete_button = document.querySelector(".all_delete_button");
const color_items = document.querySelectorAll(".color_item");
const add_task_input = document.querySelector(".add_task_input");
const selected_color = document.querySelector(".selected_color");
add_task_input.style.borderColor = selected_color.dataset.color;
var task_id = 0;

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
}

function dropHandler(event) {
    const task_id = event.dataTransfer.getData("elementID");
    const task = document.getElementById(task_id);
    event.target.appendChild(task);
}

function dragOverHandler(event) {
    event.preventDefault();
}



add_button_task.addEventListener("click", () => {
    const todo_input = document.querySelector(".add_task_input");
    const todo_title = todo_input.value;
    const new_tasks = document.querySelector(".new_tasks");
    const alert = document.querySelector(".alert");
    if (todo_title.trim() !== "") {
        const task = document.createElement("div");
        task.classList.add("task");
        task.draggable = true;
        task.id = task_id;
        task_id++;
        task.style.backgroundColor = todo_input.style.borderColor;
        task.innerHTML = `<div class="task_content">${todo_title}</div>`;
        task.addEventListener("dragstart", dragStartHandler)
        new_tasks.appendChild(task);
        todo_input.value = "";
        alert.classList.remove("alert_show");
        document.body.classList.add("hidden");
    } else  {
        alert.classList.add("alert_show");
    }
});

const deleted_tasks = document.querySelector(".deleted_tasks");
all_delete_button.addEventListener("click", () => {
    deleted_tasks.innerHTML = ``;
})


const theme_button = document.querySelector(".theme_button");
const task_wrapper = document.querySelector(".task_wrapper");
const hedder_title = document.querySelector(".hedder");
const theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "light";
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