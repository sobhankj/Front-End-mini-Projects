const successButton = document.querySelector('.button-success');
const warningButton = document.querySelector('.button-warning');
const infoButton = document.querySelector('.button-info');
const dangerButton = document.querySelector('.button-danger');
const toast = document.querySelector('.toast');
const toast_icon = document.querySelector('.toast-icon');
const toast_message = document.querySelector('.toast-message');
const proccess = document.querySelector('.proccess');
let interval;

function in_progress() {
    proccess.style.width = '0%';
    let width = 0;
    interval = setInterval(() => {
        width++;
        proccess.style.width = width + '%';
        if (width >= 100) {
            clearInterval(interval);
            toast.classList.add('hidden');
        }
    }, 20);
}

function show_toast(type) {
    switch (type) {
        case 'success':
            toast.classList.remove('hidden');
            toast_icon.src = './images/success.svg';
            toast_message.textContent = 'This is a success message';
            proccess.style.backgroundColor = '#004800';
            clearInterval(interval);
            in_progress();
            break;
        case 'warning':
            toast.classList.remove('hidden');
            toast_icon.src = './images/warning.svg';
            toast_message.textContent = 'This is a warning message';
            proccess.style.backgroundColor = '#8d5b00';
            clearInterval(interval);
            in_progress();
            break;
        case 'info':
            toast.classList.remove('hidden');
            toast_icon.src = './images/info.svg';
            toast_message.textContent = 'This is a info message';
            proccess.style.backgroundColor = '#000097';
            clearInterval(interval);
            in_progress();
            break;
        case 'danger':
            toast.classList.remove('hidden');
            toast_icon.src = './images/danger.svg';
            toast_message.textContent = 'This is a danger message';
            proccess.style.backgroundColor = '#9a0000';
            clearInterval(interval);
            in_progress();
            break;
        default:
            break;
    }
}

successButton.addEventListener('click', () => {
    show_toast('success');
});

warningButton.addEventListener('click', () => {
    show_toast('warning');
});

infoButton.addEventListener('click', () => {
    show_toast('info');
});

dangerButton.addEventListener('click', () => {
    show_toast('danger');
});

