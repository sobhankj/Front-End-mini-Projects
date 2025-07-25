const slider = document.querySelector(".slider");

slider.addEventListener("change", (e) => {
    const value = slider.value / 100;
    document.body.style.backdropFilter = `brightness(${value})`;
});