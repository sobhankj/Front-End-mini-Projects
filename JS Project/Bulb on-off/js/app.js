let bulb_image = document.querySelector(".bulb_image");
let bulb_button = document.querySelector(".bulb_button");
bulb_button.setAttribute("isOn" , false);

function On_Off () {

    console.log("click shode");
    if (bulb_button.isOn) {
        bulb_image.src = "./images/bulboff.gif";
        bulb_button.style.backgroundColor = "#212121";
        bulb_button.style.borderColor = "#212121";
        bulb_button.style.color = "#ffffff";
        bulb_button.innerHTML = "چراغ را روشن کنید";
        bulb_button.isOn = false;
    } else {
        bulb_image.src = "./images/bulbon.gif";
        bulb_button.style.backgroundColor = "#ffdd00";
        bulb_button.style.borderColor = "#ffdd00";
        bulb_button.style.color = "#000000";
        bulb_button.innerHTML = "چراغ را خاموش کنید";
        bulb_button.isOn = true;
    }
}

bulb_button.addEventListener("click" , On_Off);