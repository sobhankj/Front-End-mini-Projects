const include = [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "abcdefghijklmnopqrstuvwxyz",
    "0123456789",
    "!@#$%^&*()_+-=[]{}|;:,.<>?"
]
const password = document.getElementById("password");
const length_password = document.getElementById("length");
const length_value = document.getElementById("length_value");
const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");
const generate_password = document.getElementById("generate_password");
const power_items = document.querySelectorAll(".power_item");
let flag_uppercase = 0;
let flag_lowercase = 0;
let flag_numbers = 0;
let flag_symbols = 0;


length_password.addEventListener("input", () => {
    length_value.textContent = `length: ${length_password.value}`;
})

uppercase.addEventListener("change", () => {
    flag_uppercase = uppercase.checked ? 1 : 0;
})
lowercase.addEventListener("change", () => {
    flag_lowercase = lowercase.checked ? 10 : 0;
})
numbers.addEventListener("change", () => {
    flag_numbers = numbers.checked ? 100 : 0;
})
symbols.addEventListener("change", () => {
    flag_symbols = symbols.checked ? 1000 : 0;
})

function generate_password_function(from, password_length) {
    let password = '';
    for (let i = 0; i < password_length; i++) {
        password += from[Math.floor(Math.random() * from.length)];
    }
    return password;
}

generate_password.addEventListener("click", () => {
    let from = '';
    let password_length = length_password.value;
    let sum = flag_uppercase + flag_lowercase + flag_numbers + flag_symbols;
    switch (sum) {
        case 0:
            alert("Please select at least one option");
            break;
        case 1:
            from = include[0];
            power_items[0].classList.add("weak");
            break;
        case 10:
            from = include[1];
            power_items[0].classList.add("weak");
            break;
        case 11:
            from = include[0] + include[1];
            power_items[0].classList.add("medium");
            power_items[1].classList.add("medium");
            break;
        case 100:
            from = include[2];
            power_items[0].classList.add("weak");
            break;
        case 101:
            from = include[0] + include[2];
            power_items[0].classList.add("medium");
            power_items[1].classList.add("medium");
            break;
        case 110:
            from = include[1] + include[2];
            power_items[0].classList.add("medium");
            power_items[1].classList.add("medium");
            break;
        case 111:
            from = include[0] + include[1] + include[2];
            power_items[0].classList.add("strong");
            power_items[1].classList.add("strong");
            power_items[2].classList.add("strong");
            break;
        case 1000:
            from = include[3];
            power_items[0].classList.add("weak");
            break;
        case 1001:
            from = include[0] + include[3];
            power_items[0].classList.add("medium");
            power_items[1].classList.add("medium");
            break;
        case 1010:
            from = include[1] + include[3];
            power_items[0].classList.add("medium");
            power_items[1].classList.add("medium");
            break;
        case 1011:
            from = include[0] + include[1] + include[3];
            power_items[0].classList.add("strong");
            power_items[1].classList.add("strong");
            power_items[2].classList.add("strong");
            break;
        case 1100:
            from = include[2] + include[3];
            power_items[0].classList.add("medium");
            power_items[1].classList.add("medium");
            break;
        case 1101:
            from = include[0] + include[2] + include[3];
            power_items[0].classList.add("strong");
            power_items[1].classList.add("strong");
            power_items[2].classList.add("strong");
            break;
        case 1110:
            from = include[1] + include[2] + include[3];
            power_items[0].classList.add("strong");
            power_items[1].classList.add("strong");
            power_items[2].classList.add("strong");
            break;
        case 1111:
            from = include[0] + include[1] + include[2] + include[3];
            power_items[0].classList.add("very_strong");
            power_items[1].classList.add("very_strong");
            power_items[2].classList.add("very_strong");
            power_items[3].classList.add("very_strong");
            break;
    }
    password.innerHTML = generate_password_function(from, password_length);
})