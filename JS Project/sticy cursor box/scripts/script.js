const box = document.querySelector(".box");

document.body.addEventListener("mousemove", (e) => {
    box.style.display = "block";
    box.style.transform = `translate3d(${e.clientX - 25}px, ${e.clientY - 25}px , 0)`;
    box.style.transition = "transform 0.07s ease";
}); 