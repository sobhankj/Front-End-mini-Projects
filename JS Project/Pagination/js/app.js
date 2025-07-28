const content = document.querySelectorAll('.content');
let page_count_each = 4;

let page_count = Math.floor(content.length / page_count_each);
if (content.length % page_count_each !== 0) {
    page_count++;
}
for (let i = 1; i <= page_count; i++) {
    const page_counter = document.createElement('span');
    page_counter.classList.add('page_counter_number');
    page_counter.textContent = i;
    page_counter.setAttribute('data-page', i);
    if (i === 1) {
        page_counter.classList.add('active');
    }
    page_counter.addEventListener('click', () => {
        document.querySelector('.page_counter_number.active').classList.remove('active');
        page_counter.classList.add('active');


        let page_number = page_counter.getAttribute('data-page');
        for (let j = 0; j < content.length; j++) {
            content[j].classList.add('hidden');
        }
        for (let j = (page_number - 1) * page_count_each; j < (page_number-1) * page_count_each + page_count_each; j++) {
            content[j].classList.remove('hidden');
        }
    });
    document.querySelector('.page_counter').appendChild(page_counter);
}

for (let j = 0; j < content.length; j++) {
    content[j].classList.add('hidden');
}
for (let j = 0; j < page_count_each; j++) {
    content[j].classList.remove('hidden');
}