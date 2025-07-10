let gen_button = document.querySelector(".button_generator");
let body = document.querySelector("body");
let color_code = document.querySelector(".color_code");
let red_degree = 0;
let green_degree = 0;
let blue_degree = 0;


gen_button.addEventListener("click" , function() {
    red_degree = Math.floor(Math.random() * 256);
    green_degree = Math.floor(Math.random() * 256);
    blue_degree = Math.floor(Math.random() * 256);

    body.style.backgroundColor = `rgb(${red_degree},${green_degree},${blue_degree})`;
    color_code.innerHTML = `rgb(${red_degree},${green_degree},${blue_degree})`;
});