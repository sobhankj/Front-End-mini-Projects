const input = document.querySelector(".input");
const maxLength = document.querySelector(".max-length");
const button = document.querySelector(".button");

maxLength.innerHTML = input.maxLength;

input.addEventListener("keyup" , function () {
    maxLength.innerHTML = input.maxLength - input.value.length;
    if (input.value.length === input.maxLength) {
        maxLength.style.backgroundColor = "green";
        button.style.backgroundColor = "green";
        button.disabled = false;
        button.style.cursor = "pointer";
    }
    else {
        maxLength.style.backgroundColor = "rgb(186, 1, 1)";
        button.style.backgroundColor = "rgb(186, 1, 1)";
        button.disabled = true;
        button.style.cursor = "default";
    }
});

button.addEventListener("click" , function () {
    button.innerHTML = "Sending...";
    input.disabled = true;
});