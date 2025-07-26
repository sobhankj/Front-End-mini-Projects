const text_area = document.querySelector("#text_area");
const char = document.querySelector("#char");
const word = document.querySelector("#word");
const sentence = document.querySelector("#sentence");
const paragraph = document.querySelector("#paragraph");

function calculate_char(text) {
    let char_count = text.replace(" " , "").replace("\n" , "").split("").filter(char => char !== " ").length;
    return char_count;
}

function calculate_word(text) {
    let word_count = text.trim().split(/\s+/).filter(word => word !== "" && word !== ".").length;
    return word_count;
}

function calculate_sentence(text) {
    let sentence_count = text.split(".").filter(sentence => sentence.trim() !== "").length;
    return sentence_count;
}

function calculate_paragraph(text) {
    let paragraph_count = text.split("\n").filter(paragraph => paragraph.trim() !== "").length;
    return paragraph_count;
}


text_area.addEventListener("input", () => {
    char.innerHTML = calculate_char(text_area.value);
    word.innerHTML = calculate_word(text_area.value);
    sentence.innerHTML = calculate_sentence(text_area.value);
    paragraph.innerHTML = calculate_paragraph(text_area.value);
})