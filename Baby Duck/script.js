const boxWrapper = document.querySelector('.content');
const button = document.querySelector('button');


button.addEventListener('click', () => {
    if (getComputedStyle(boxWrapper).justifyContent === 'space-around') {
        boxWrapper.style.justifyContent = 'center';
        button.innerHTML = 'بچه را از مادرش بگیر';
    } else {
        boxWrapper.style.justifyContent = 'space-around';
        button.innerHTML = 'بچه را به مادرش برسان';
    }
});