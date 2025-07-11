let submit_button = document.querySelector(".submit_button");
let clear_button = document.querySelector(".clear_button");
let celsius_input = document.querySelector("#celsius");
let fahrenheit_input = document.querySelector("#fahrenheit");

function calculate() {
    let input = celsius_input.value.trim();
    let celsius_value = Number(input);

    if (input === "" || Number.isNaN(celsius_value)) {
        celsius_input.value = "";
        celsius_input.placeholder = "Please enter a valid number!!!";
        fahrenheit_input.value = "";
    }
    else {
        fahrenheit_input.value = (celsius_value * 9 / 5) + 32;
    }
}

function clear() {
    celsius_input.value = "";
    celsius_input.placeholder = "Please enter the desired amount.";
    fahrenheit_input.value = "";
}


celsius_input.addEventListener("focus" , function() {
    celsius_input.placeholder = "Please enter the desired amount.";
});

submit_button.addEventListener("click" , calculate);

clear_button.addEventListener("click" , clear);