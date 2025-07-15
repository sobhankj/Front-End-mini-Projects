const terms_button = document.querySelector(".terms_button");
const modal_container = document.querySelector(".modal_container");
const accept_button = document.querySelector(".accept_button");
const reject_button = document.querySelector(".reject_button");


function remove_show () {
    document.body.classList.remove("show");
}

terms_button.addEventListener("click" , function () {
    document.body.classList.add("show");    
})

accept_button.addEventListener("click" , remove_show);

reject_button.addEventListener("click" , remove_show);

document.body.addEventListener("keydown" , function (e) {
    if (e.key === "Escape") {
        remove_show();
    }
})