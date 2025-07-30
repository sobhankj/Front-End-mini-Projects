const os = document.querySelector(".os");
const app = document.querySelector(".app");

console.log(navigator);


if (navigator.userAgent.includes("Windows")) {
    os.textContent = "Windows";
} else if (navigator.userAgent.includes("MacOS")) {
    os.textContent = "MacOs";
}
if(navigator.userAgent.includes("Chrome")) {
    app.textContent = "Chrome";
} else if (navigator.userAgent.includes("Firefox")) {
    app.textContent = "Firefox";
} else if (navigator.userAgent.includes("Safari")) {
    app.textContent = "Safari";
}