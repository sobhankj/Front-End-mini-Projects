const container = document.querySelector(".container");
const p = document.querySelector("p");
window.addEventListener("online", () => {
    container.style.display = "flex";
    console.log("online");
    p.textContent = "You are Online!";
    container.style.backgroundColor = "#064600";
    setInterval(() => {
        container.style.display = "none";
    }, 3000);
});

window.addEventListener("offline", () => {
    console.log("offline");
    container.style.display = "flex";
    p.textContent = "You are Offline!";
    container.style.backgroundColor = "#460000";
});