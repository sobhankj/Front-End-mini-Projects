const audio = document.querySelector("audio");
const modalSettings = document.querySelector(".modal-settings");
const settingsButton = document.querySelector(".settings-button");
const backMenuButton = document.querySelector(".backMenu-button");
const closeButton = document.querySelector(".close-button");
const audioRange = document.querySelector("#audio-range");
const rockPlayer1 = document.querySelector(".rock-player1");
const scissorsPlayer1 = document.querySelector(".scissors-player1");
const paperPlayer1 = document.querySelector(".paper-player1");
const rockPlayer2 = document.querySelector(".rock-player2");
const scissorsPlayer2 = document.querySelector(".scissors-player2");
const paperPlayer2 = document.querySelector(".paper-player2");
const finalSelectPlayer1 = document.querySelector(".player1-final");
const finalSelectPlayer2 = document.querySelector(".player2-final");
const specialHero1Player1 = document.querySelector(".hero1-player1");
const specialHero2Player1 = document.querySelector(".hero2-player1");
const specialHero1Player2 = document.querySelector(".hero1-player2");
const specialHero2Player2 = document.querySelector(".hero2-player2");
const scorePlayer1 = document.querySelector(".player1-score");
const scorePlayer2 = document.querySelector(".player2-score");
const resualtGame = document.querySelector(".who-win");
const game1 = document.querySelector(".game1");
const game2 = document.querySelector(".game2");
const game1v1 = document.querySelector(".game-section-1v1");
const mainMenu = document.querySelector(".options-section");

let timer;
let flag = true;
let optionPlayer1;
let optionPlayer2;


// Audio
audio.volume = 0.5;
document.addEventListener("keydown" , (event) => {
    if (event.key === "m") {
        audio.play();
        if (audio.ended) {
            audio.play();
        }
    }
});

// Modal Settings
settingsButton.addEventListener("click", () => {
    modalSettings.classList.add("active");
});

closeButton.addEventListener("click", () => {
    modalSettings.classList.remove("active");
});

audioRange.addEventListener("input", () => {
    audio.volume = audioRange.value;
});



// menu
backMenuButton.addEventListener("click" , () => {
    const temp = document.querySelector(".active");
    temp.classList.remove("active");
    mainMenu.classList.add("active");
    clearInterval(timer);
    resualtGame.innerHTML = "Get Ready ...";
    flag = true;
});


game2.addEventListener("click" , () => {
    mainMenu.classList.remove("active");
    game1v1.classList.add("active");
});


// game
document.addEventListener('keydown' , (event) => {
    if (event.key === "Enter" && flag === true) {
        flag = false;
        resualtGame.innerHTML = "2"; 
        let sec = 1;
        timer = setInterval(() => {
            document.addEventListener("keydown" , (event) => {
                if (event.key === "j") {
                    optionPlayer2 = "rock";
                } else if (event.key === "k") {
                    optionPlayer2 = "scissors";
                } else if (event.key === "l") {
                    optionPlayer2 = "paper";
                } else if (event.key === "a") {
                    optionPlayer1 = "rock";
                } else if (event.key === "s") {
                    optionPlayer1 = "scissors";
                } else if (event.key === "d") {
                    optionPlayer1 = "paper";
                }
            })
            resualtGame.innerHTML = sec;
            sec--;
            if (sec === -1) {
                clearInterval(timer);
                flag = true;
                resualtGame.innerHTML = "Get Ready ...";
                switch (optionPlayer1) {
                    case "rock":
                        finalSelectPlayer1.src = "./images/rock-svgrepo-com.svg";
                        break;
                    case "scissors":
                        finalSelectPlayer1.src = "./images/scissors-svgrepo-com.svg";
                        break;
                    case "paper":
                        finalSelectPlayer1.src = "./images/paper-document-file-data-svgrepo-com.svg";
                        break;
                }
                switch (optionPlayer2) {
                    case "rock":
                        finalSelectPlayer2.src = "./images/rock-svgrepo-com.svg";
                        break;
                    case "scissors":
                        finalSelectPlayer2.src = "./images/scissors-svgrepo-com.svg";
                        break;
                    case "paper":
                        finalSelectPlayer2.src = "./images/paper-document-file-data-svgrepo-com.svg";
                        break;
                }
                finalSelectPlayer1.style.opacity = 1;
                finalSelectPlayer2.style.opacity = 1;
                if (optionPlayer1 === optionPlayer2) {
                    resualtGame.innerHTML = "Draw";
                } else if (optionPlayer1 === "rock" && optionPlayer2 === "scissors") {
                    resualtGame.innerHTML = "Player 1 win";
                    scorePlayer1.innerHTML++;
                } else if (optionPlayer1 === "scissors" && optionPlayer2 === "paper") {
                    resualtGame.innerHTML = "Player 1 win";
                    scorePlayer1.innerHTML++;
                } else if (optionPlayer1 === "paper" && optionPlayer2 === "rock") {
                    resualtGame.innerHTML = "Player 1 win";
                    scorePlayer1.innerHTML++;
                } else {
                    resualtGame.innerHTML = "Player 2 win";
                    scorePlayer2.innerHTML++;
                }
            }
        }, 1000);
    }
});