const body_elem = document.body;
const key_code = document.querySelector(".bold");
const event_key = document.querySelector(".con1");
const loc_key = document.querySelector(".con2");
const code_key = document.querySelector(".con3");
const witch_key = document.querySelector(".con4");
const name_key = document.querySelector(".code-section h2");

body_elem.addEventListener("keydown" , function (event) {
    body_elem.classList.remove("hidden-box");
    event.preventDefault();
    key_code.innerHTML = event.keyCode;
    event_key.innerHTML = event.key;
    loc_key.innerHTML = event.location;
    code_key.innerHTML = event.code;
    witch_key.innerHTML = event.which;
    name_key.innerHTML = `The Key you pressed: ${event.code}`;
});