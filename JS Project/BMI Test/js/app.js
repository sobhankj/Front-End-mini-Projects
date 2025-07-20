const height_input = document.getElementById("height");
const weight_input = document.getElementById("weight");
const calculate_button = document.querySelector(".calculate_button");
const close_modal = document.querySelector(".close_modal");
const close_button = document.querySelector(".close_button");


function calculateBMI() {
    console.log("calculateBMI");
    if (height_input.value === "" || weight_input.value === "") {
        alert("Please enter your height and weight");
        return;
    }
    if (isNaN(height_input.value) || isNaN(weight_input.value)) {
        alert("Please enter a valid height and weight");
        return;
    }
    if (height_input.value <= 0 || weight_input.value <= 0) {
        alert("Please enter a valid height and weight");
        return;
    }
    if (height_input.value > 250 || weight_input.value > 500) {
        alert("Please enter a valid height and weight");
        return;
    }
    const height = height_input.value / 100;
    const weight = weight_input.value;
    const bmi = weight / (height * height);
    const result_BMI = document.querySelector(".result_BMI");
    const total_status = document.getElementById("total_status");
    document.body.classList.add("show_modal");
    height_input.value = "";
    weight_input.value = "";

    result_BMI.textContent = bmi.toFixed(2);
    if (bmi < 18.5) {
        total_status.textContent = "Underweight";
        result_BMI.style.color = "#D84315";
        total_status.style.color = "#D84315";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        total_status.textContent = "Normal weight";
        result_BMI.style.color = "#4CAF50";
        total_status.style.color = "#4CAF50";
    } else if (bmi >= 25 && bmi <= 29.9) {
        total_status.textContent = "Overweight";
        result_BMI.style.color = "#F9A825";
        total_status.style.color = "#F9A825";
    } else {
        total_status.textContent = "Obesity";
        result_BMI.style.color = "#C62828";
        total_status.style.color = "#C62828";
    }
}

calculate_button.addEventListener("click", calculateBMI);
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        calculateBMI();
    }
});

close_modal.addEventListener("click", () => {
    document.body.classList.remove("show_modal");
});
close_button.addEventListener("click", () => {
    document.body.classList.remove("show_modal");
});