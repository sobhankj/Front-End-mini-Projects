const contextMenu = document.querySelector(".context-menu");
const copyIcon = document.querySelector(".copy-icon");
const cutIcon = document.querySelector(".cut-icon");
const pasteIcon = document.querySelector(".paste-icon");
const enterButton = document.querySelector(".enter-button");
const openWithButton = document.querySelector(".open-with-button");
const runTerminalButton = document.querySelector(".run-terminal-button");
const propertiesButton = document.querySelector(".properties-button");
const shareWithButton = document.querySelector(".share-with-button");
const quickAccessButton = document.querySelector(".quick-access-button");


document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    contextMenu.style.display = "block";
    contextMenu.style.top = `${e.clientY}px`;
    contextMenu.style.left = `${e.clientX}px`;
});

document.addEventListener("click", () => {
    contextMenu.style.display = "none";
});

copyIcon.addEventListener("click", () => {
    console.log("copy");
});

cutIcon.addEventListener("click", () => {
    console.log("cut");
});

pasteIcon.addEventListener("click", () => {
    console.log("paste");
});

enterButton.addEventListener("click", () => {
    console.log("enter");
});

openWithButton.addEventListener("click", () => {
    console.log("open with");
});

runTerminalButton.addEventListener("click", () => {
    console.log("run terminal");
});

propertiesButton.addEventListener("click", () => {
    console.log("properties");
});

shareWithButton.addEventListener("click", () => {
    console.log("share with");
});

quickAccessButton.addEventListener("click", () => {
    console.log("quick access");
});