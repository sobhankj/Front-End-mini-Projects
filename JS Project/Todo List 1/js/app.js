const add_button = document.querySelector(".add_button");
const close_button_task = document.querySelector(".close_button_task");
const cancel_button_task = document.querySelector(".cancel_button_task");
const add_button_task = document.querySelector(".add_button_task");
const all_delete_button = document.querySelector(".all_delete_button");
var single_delete_buttons = document.querySelectorAll(".single_delete_button");

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

add_button_task.addEventListener("click", () => {
    const todo_input = document.querySelector(".add_task_input");
    const todo_title = todo_input.value;
    const task_wrapper = document.querySelector(".task_wrapper");
    const alert = document.querySelector(".alert");
    if (todo_title.trim() !== "") {
        const task = document.createElement("div");
        task.classList.add("task");
        task.innerHTML = `<div class="task_content">${todo_title}</div>
        <button class="button single_delete_button">Delete</button>`;
        task_wrapper.appendChild(task);
        todo_input.value = "";
        alert.classList.remove("alert_show");
        document.body.classList.add("hidden");
        const single_delete_buttons = task.querySelector(".single_delete_button");
        single_delete_buttons.addEventListener("click", () => {
            const task = single_delete_buttons.parentElement;
            task.remove();
        });
    } else  {
        alert.classList.add("alert_show");
    }
});

all_delete_button.addEventListener("click", () => {
    const task_wrapper = document.querySelector(".task_wrapper");
    task_wrapper.innerHTML = "";
});