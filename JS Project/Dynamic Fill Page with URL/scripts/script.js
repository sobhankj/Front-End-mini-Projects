const buttons = document.querySelectorAll("button");
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const id = button.dataset.id;
        window.location.href = `./show.html?id=${id}`;
    });
});