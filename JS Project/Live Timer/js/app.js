const hour_number = document.querySelector(".hour_number");
const minute_number = document.querySelector(".minute_number");
const second_number = document.querySelector(".second_number");

setInterval(() => {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    hour_number.textContent = hour < 10 ? `0${hour}` : hour;
    minute_number.textContent = minute < 10 ? `0${minute}` : minute;
    second_number.textContent = second < 10 ? `0${second}` : second;
}, 1000);