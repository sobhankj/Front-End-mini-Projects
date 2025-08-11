const questions = [
    {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        answer: 0,
        user_answer: null,
    },
    {
        question: "What is the capital of Germany?",
        options: ["Berlin", "Paris", "London", "Madrid"],
        answer: 0,
        user_answer: null,
    },
    {
        question: "What is the capital of Italy?",
        options: ["Rome", "Paris", "London", "Madrid"],
        answer: 0,
        user_answer: null,
    },
    {
        question: "What is the capital of Spain?",
        options: ["Madrid", "Paris", "London", "Berlin"],
        answer: 0,
        user_answer: null,
    },
    {
        question: "What is the capital of Portugal?",
        options: ["Lisbon", "Paris", "London", "Berlin"],
        answer: 0,
        user_answer: null,
    },
]

let currentQuestion = 0;
let score = 0;
let minutes = 3;
let seconds = 0;
let timer;

const index_questionElem = document.querySelector(".index_question");
const time_questionElem = document.querySelector(".time_question");
const questionElem = document.querySelector(".Question");
const optionsElem = document.querySelectorAll(".option");
const btn_prevElem = document.querySelector(".btn_prev");
const btn_nextElem = document.querySelector(".btn_next");
const btn_submitElem = document.querySelector(".btn_submit");
const resualt_reportElem = document.querySelector(".resualt_report");
const option_input = document.querySelectorAll(".option_input");
const res_score_valueElem = document.querySelector(".res_score_value");
const res_time_valueElem = document.querySelector(".res_time_value");
const res_percentage_valueElem = document.querySelector(".res_percentage_value");
const AnsResCirculElem = document.querySelector(".AnsResCircul");


index_questionElem.textContent = `Question ${currentQuestion + 1} / ${questions.length}`;
showTime(minutes, seconds);

function showTime(minutes, seconds) {
    if (seconds < 10) {
        if (minutes < 10) {
            time_questionElem.textContent = `0${minutes}:0${seconds}`;
        } else {
            time_questionElem.textContent = `${minutes}:0${seconds}`;
        }
    } else {
        if (minutes < 10) {
            time_questionElem.textContent = `0${minutes}:${seconds}`;
        } else {
            time_questionElem.textContent = `${minutes}:${seconds}`;
        }
    }
}
timer = setInterval(() => {
    seconds--;
    if (seconds < 0) {
        minutes--;
        seconds = 59;
    }
    if (minutes < 0) {
        minutes = 0;
        seconds = 0;
    }
    showTime(minutes, seconds);
    if (minutes === 0 && seconds === 0) {
        clearInterval(timer);
        resualt_reportElem.classList.remove("hidden");
        calculateResualt();
    }
}, 1000);


showQuestion();
function showQuestion() {
    const question = questions[currentQuestion];
    questionElem.textContent = question.question;
    optionsElem.forEach((option, index) => {
        option.querySelector(".option_text").textContent = question.options[index];
        option.querySelector(".option_input").checked = (question.user_answer === index) ? true : false;
    });
}

function findUserAnswer() {
    for (let index = 0; index < 4; index++) {
        if (option_input[index].checked) {
            return index;
        }
    }
}

btn_nextElem.addEventListener("click", () => {
    questions[currentQuestion].user_answer = findUserAnswer();
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
        index_questionElem.textContent = `Question ${currentQuestion + 1} / ${questions.length}`;
    }
})

btn_prevElem.addEventListener("click", () => {
    questions[currentQuestion].user_answer = findUserAnswer();
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
        index_questionElem.textContent = `Question ${currentQuestion + 1} / ${questions.length}`;
    }
})


function calculateResualt() {
    console.log(questions);
    
    for (let index = 0; index < questions.length; index++) {
        const question = questions[index];
        if (question.user_answer === question.answer) {
            score++;
        }
    }
    res_score_valueElem.textContent = `${score} / ${questions.length}`;
    res_time_valueElem.textContent = `${minutes}:${seconds}`;
    res_percentage_valueElem.textContent = `${(score / questions.length) * 100}%`;
    if (score / questions.length >= 0.8) {
        AnsResCirculElem.textContent = "A";
        AnsResCirculElem.style.backgroundColor = "#1B5E20";
    } else if (score / questions.length >= 0.5) {
        AnsResCirculElem.textContent = "B";
        AnsResCirculElem.style.backgroundColor = "#FFEA00";
    } else if (score / questions.length >= 0.3) {
        AnsResCirculElem.textContent = "C";
        AnsResCirculElem.style.backgroundColor = "#E65100";
    } else {
        AnsResCirculElem.textContent = "D";
        AnsResCirculElem.style.backgroundColor = "#B71C1C";
    }
}

btn_submitElem.addEventListener("click", () => {
    questions[currentQuestion].user_answer = findUserAnswer();
    clearInterval(timer);
    resualt_reportElem.classList.remove("hidden");
    calculateResualt();
})

