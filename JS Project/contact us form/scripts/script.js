const gamil_list = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com", "icloud.com", "zoho.com", "yandex.com", "protonmail.com", "tutanota.com", "fastmail.com", "gmx.com", "inbox.com", "mail.com", "mail.ru", "zoho.com", "yandex.com", "protonmail.com", "tutanota.com", "fastmail.com", "gmx.com", "inbox.com", "mail.com", "mail.ru"];

const email = document.getElementById("email");
const submit = document.getElementById("submit");
const toast = document.querySelector(".toast");
const progressBar = document.querySelector(".progress-bar");
let progress = 0;

submit.addEventListener("click", () => {
    if (email.value === "") {
        email.placeholder = "Please enter your email";
    } else {
        email.placeholder = "Enter your email";
        if (email.value.includes("@")) {
            toast.classList.remove("hidden");
            gamil_list.push(email.value);
            progressBar.style.width = "0%";
            progress = 0;
            const interval = setInterval(() => {
                progress += 1;
                progressBar.style.width = `${progress}%`;
                if (progress === 100) {
                    clearInterval(interval);
                    toast.classList.add("hidden");
                }
            }, 20);
        } else {
            email.value = "";
            email.placeholder = "Please enter a valid email";
        }
    }
});