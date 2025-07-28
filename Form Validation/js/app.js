let username_input = document.querySelector(".username");
let password_input = document.querySelector(".password");
let submit_button = document.querySelector(".submit-buttom");
let user_invalid_text = document.querySelector(".invalid_username");
let pass_invalid_text = document.querySelector(".invalid_password");
let res_text = document.querySelector(".s_loggin");
let res_text_image = document.querySelector(".s_loggin_content_image"); 
let res_text_text = document.querySelector(".s_loggin_content_text");
let close_button = document.querySelector(".close_s_loggin");
const captcha_text = document.querySelector(".captcha_text");
const reset_captcha = document.querySelector(".resetCapcha");
const captcha_input = document.querySelector(".captcha");
let isOk_username = false;
let isOk_password = false;

submit_button.addEventListener("click", function (event) {
    event.preventDefault();

    res_text.classList.remove("hidden");
    if (isOk_username && isOk_password && captcha_text.innerHTML === captcha_input.value) {
        user_invalid_text.classList.add("hidden");
        pass_invalid_text.classList.add("hidden");
        res_text_image.setAttribute("src" , "./images/correct-success-tick-svgrepo-com.svg");
        res_text_text.innerHTML = "You have successfully logged in."
        res_text_text.style.color = "forestgreen";
    } else {
        res_text_image.setAttribute("src" , "./images/error-svgrepo-com.svg");
        res_text_text.innerHTML = "You can't loggin"
        res_text_text.style.color = "red";
    }
});

close_button.addEventListener("click" , function () {
    res_text.classList.add("hidden");
});

username_input.addEventListener("keyup" , function() {
    let user_val = username_input.value;

    if (user_val.length <= 3) {
        user_invalid_text.classList.remove("hidden");
        isOk_username = false;
    } else {
        isOk_username = true;
        user_invalid_text.classList.add("hidden");
    }
});

password_input.addEventListener("keyup" , function() {
    let pas_val = password_input.value;
    if (pas_val.length <= 6) {
        pass_invalid_text.classList.remove("hidden");
        isOk_password = false;
    } else {
        pass_invalid_text.classList.add("hidden");
        isOk_password = true;
    }
});

const captcha_generator = () => {
    const characters = "ABCnopqrstJKL012345MNOPQRSZabcdefghijklmuvwxyz67TUVWXY89";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captcha;
}

reset_captcha.addEventListener("click" , function() {
    captcha_text.innerHTML = captcha_generator();
});

captcha_text.innerHTML = captcha_generator();