let username_input = document.querySelector(".username");
let password_input = document.querySelector(".password");
let submit_button = document.querySelector(".submit-buttom");
let user_invalid_text = document.querySelector(".invalid_username");
let pass_invalid_text = document.querySelector(".invalid_password");
let succes_text = document.querySelector(".s_loggin");
let close_button = document.querySelector(".close_s_loggin");

submit_button.addEventListener("click", function (event) {
    event.preventDefault();
    let user_val = username_input.value;
    let pas_val = password_input.value;
    let isOk = true;

    if (user_val.length <= 3) {
        user_invalid_text.classList.remove("hidden");
        isOk = false;
    } else {
        user_invalid_text.classList.add("hidden");
    }

    if (pas_val.length <= 6) {
        pass_invalid_text.classList.remove("hidden");
        isOk = false;
    } else {
        pass_invalid_text.classList.add("hidden");
    }

    if (isOk) {
        user_invalid_text.classList.add("hidden");
        pass_invalid_text.classList.add("hidden");
        succes_text.classList.remove("hidden");
    }
});

close_button.addEventListener("click" , function () {
    succes_text.classList.add("hidden");
});