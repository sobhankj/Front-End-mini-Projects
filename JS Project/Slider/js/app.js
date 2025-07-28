const slider_images = [
    './images/1.webp',
    './images/2.webp',
    './images/3.webp',
    './images/4.webp',
    './images/5.webp',
]

const prev_pic = document.querySelector('.prev_pic');
const next_pic = document.querySelector('.next_pic');
const slider_content = document.querySelector('.slider_content');
const slider_info_pic = document.querySelectorAll('.slider_info_pic');
let index = 0;

next_pic.addEventListener('click', () => {
    index++;
    if (index > slider_images.length - 1) {
        index = 0;
    }
    slider_content.style.backgroundImage = `url(${slider_images[index]})`;
    slider_info_pic.forEach(pic => pic.classList.remove('active'));
    slider_info_pic[index].classList.add('active');
});

prev_pic.addEventListener('click', () => {
    index--;
    if (index < 0) {
        index = slider_images.length - 1;
    }
    slider_content.style.backgroundImage = `url(${slider_images[index]})`;
    slider_info_pic.forEach(pic => pic.classList.remove('active'));
    slider_info_pic[index].classList.add('active');
});

slider_info_pic.forEach((pic, index) => {
    pic.addEventListener('click', () => {
        index = index;
        slider_content.style.backgroundImage = `url(${slider_images[index]})`;
        slider_info_pic.forEach(pic => pic.classList.remove('active'));
        pic.classList.add('active');
    });
});