let username_input = document.querySelector(".username");
let password_input = document.querySelector(".password");
let submit_button = document.querySelector(".submit-buttom");
let user_invalid_text = document.querySelector(".invalid_username");
let pass_invalid_text = document.querySelector(".invalid_password");
let res_text = document.querySelector(".s_loggin");
let res_text_image = document.querySelector(".s_loggin_content_image"); 
let res_text_text = document.querySelector(".s_loggin_content_text");
let close_button = document.querySelector(".close_s_loggin");
let isOk_username = false;
let isOk_password = false;

submit_button.addEventListener("click", function (event) {
    event.preventDefault();

    res_text.classList.remove("hidden");
    if (isOk_username && isOk_password) {
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
        user_invalid_text.innerHTML = "The username must has more than 3 character";
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
        pass_invalid_text.innerHTML = "The password must has more than 6 character";
        isOk_password = false;
    } else {
        pass_invalid_text.classList.add("hidden");
        isOk_password = true;
    }
});

username_input.addEventListener("blur" , function () {
    if (!isOk_username) {
        user_invalid_text.classList.remove("hidden");
        user_invalid_text.innerHTML = "you didn't fill this field!";
    }
});

password_input.addEventListener("blur" , function () {
    if (!isOk_password) {
        pass_invalid_text.classList.remove("hidden");
        pass_invalid_text.innerHTML = "you didn't fill this field!";
    }
});

password_input.addEventListener("keydown" , function (event) {
    console.log(event.key);
});



function preloader() {
    let preloader = document.querySelector(".preloader");
    preloader.classList.add("hidden-preloader");
}