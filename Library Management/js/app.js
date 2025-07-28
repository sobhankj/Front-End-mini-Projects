const add_button = document.querySelector(".add_button");
const close_button_book = document.querySelector(".close_button_book");
const cancel_button_book = document.querySelector(".cancel_button_book");
const add_button_book = document.querySelector(".add_button_book");
const all_delete_button = document.querySelector(".all_delete_button");
var single_delete_buttons = document.querySelectorAll(".single_delete_button");
const color_items = document.querySelectorAll(".color_item");
const add_book_input = document.querySelector(".add_book_input");
const add_author_input = document.querySelector(".add_author_input");
const add_date_input = document.querySelector(".add_date_input");
let id = localStorage.getItem("id") || 0;

let books = JSON.parse(localStorage.getItem("book")) || [];
if (books.length > 0) {
    books.forEach(book => {
        const book_wrapper = document.querySelector(".book_wrapper");
        const new_book = document.createElement("div");
        new_book.classList.add("book");
        new_book.style.backgroundColor = book.color;
        new_book.dataset.id = book.id;
        new_book.innerHTML = `<div class="book_content">${book.book_title}</div>
        <div class="book_content">${book.author}</div>
        <div class="book_content">${book.date}</div>
        <button class="button single_delete_button">Delete</button>`;
        const single_delete_buttons = new_book.querySelector(".single_delete_button");
        single_delete_buttons.addEventListener("click", () => {
            const book_id = new_book.dataset.id;
            const book = single_delete_buttons.parentElement;
            book.remove();
            books = books.filter(book => book.id !== +book_id);
            localStorage.setItem("book", JSON.stringify(books));
        });
        book_wrapper.appendChild(new_book);
    })
}

color_items.forEach(color_item => {
    color_item.style.backgroundColor = color_item.dataset.color;
    color_item.addEventListener("click", () => {
        add_book_input.style.borderColor = color_item.dataset.color;
        add_author_input.style.borderColor = color_item.dataset.color;
        add_date_input.style.borderColor = color_item.dataset.color;
        const selected_color = document.querySelector(".selected_color");
        selected_color.classList.remove("selected_color");
        color_item.classList.add("selected_color");
    })
})


add_button.addEventListener("click", () => {
    document.body.classList.remove("hidden");
    const book_input = document.querySelector(".add_book_input");
    book_input.focus();
});

close_button_book.addEventListener("click", () => {
    document.body.classList.add("hidden");
    const alert = document.querySelector(".alert");
    alert.classList.remove("alert_show");
    const book_input = document.querySelector(".add_book_input");
    book_input.value = "";
});

cancel_button_book.addEventListener("click", () => {
    document.body.classList.add("hidden");
    const alert = document.querySelector(".alert");
    alert.classList.remove("alert_show");
    const book_input = document.querySelector(".add_book_input");
    book_input.value = "";
});

document.body.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        document.body.classList.add("hidden");
        const book_input = document.querySelector(".add_book_input");
        book_input.value = "";
    } else if (event.key === "Enter" && document.body.classList.contains("hidden") === false) {
        add_button_book.click();
    }
});

add_button_book.addEventListener("click", () => {
    const book_input = document.querySelector(".add_book_input");
    const book_title = book_input.value;
    const book_wrapper = document.querySelector(".book_wrapper");
    const author_input = document.querySelector(".add_author_input");
    const date_input = document.querySelector(".add_date_input");
    const alert = document.querySelector(".alert");
    const author = author_input.value;
    const date = date_input.value;
    if (book_title.trim() !== "") {
        const book = document.createElement("div");
        book.classList.add("book");
        book.style.backgroundColor = add_book_input.style.borderColor;
        book.dataset.id = id;
        book.innerHTML = `<div class="book_content">${book_title}</div>
        <div class="book_content">${author}</div>
        <div class="book_content">${date}</div>
        <button class="button single_delete_button">Delete</button>`;
        book_wrapper.appendChild(book);
        book_input.value = "";
        author_input.value = "";
        date_input.value = "";
        const storage_item = {
            id: id++,
            book_title: book_title,
            author: author,
            date: date,
            color: add_book_input.style.borderColor
        }
        localStorage.setItem("id", id);
        books.push(storage_item);
        localStorage.setItem("book", JSON.stringify(books));
        alert.classList.remove("alert_show");
        document.body.classList.add("hidden");
        const single_delete_buttons = book.querySelector(".single_delete_button");
        single_delete_buttons.addEventListener("click", () => {
            const book_id = book.dataset.id;
            single_delete_buttons.parentElement.remove();
            books.forEach(bookabc => {
                if (bookabc.id === +book_id) {
                    books.splice(books.indexOf(bookabc), 1);
                }
            });
            console.log(books);
            localStorage.setItem("book", JSON.stringify(books));
        });
    } else  {
        alert.classList.add("alert_show");
    }
});

all_delete_button.addEventListener("click", () => {
    const book_wrapper = document.querySelector(".book_wrapper");
    book_wrapper.innerHTML = "";
    books = [];
    localStorage.removeItem("book");
    localStorage.removeItem("id");
});