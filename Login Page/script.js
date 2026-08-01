const signinBtn = document.querySelector('.signin_button');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const usernameErrorMessage = document.querySelector('.username_error_message');
const passwordErrorMessage = document.querySelector('.password_error_message');
const successModal = document.querySelector('#success_modal');
const modalCloseButton = document.querySelector('.modal_close_button');

let isUsernameValid = false;
let isPasswordValid = false;

usernameInput.addEventListener('blur', () => {
    if (usernameInput.value.length === 0) {
        usernameErrorMessage.classList.remove('hidden');
        usernameErrorMessage.textContent = 'Fill username field';
        isUsernameValid = false;
    } else {
        usernameErrorMessage.textContent = 'Username must be at least 3 characters long';
    }
});

passwordInput.addEventListener('blur', () => {
    if (passwordInput.value.length === 0) {
        passwordErrorMessage.classList.remove('hidden');
        passwordErrorMessage.textContent = 'Fill password field';
        isPasswordValid = false;
    } else {
        passwordErrorMessage.textContent = 'Password must be at least 8 characters long';
    }
});

usernameInput.addEventListener('keyup', () => {
    usernameErrorMessage.textContent = 'Username must be at least 3 characters long';
    if (usernameInput.value.length === 0) {
        usernameErrorMessage.classList.add('hidden');
        isUsernameValid = false;
    } else {
        if (usernameInput.value.length < 3) {
            usernameErrorMessage.classList.remove('hidden');
            isUsernameValid = false;
        } else {
            usernameErrorMessage.classList.add('hidden')
            isUsernameValid = true;
        }
    }
});

passwordInput.addEventListener('keyup', () => {
    passwordErrorMessage.textContent = 'Password must be at least 8 characters long';
    if (passwordInput.value.length === 0) {
        passwordErrorMessage.classList.add('hidden');
        isPasswordValid = false;
    } else {
        if (passwordInput.value.length < 8) {
            passwordErrorMessage.classList.remove('hidden');
            isPasswordValid = false;
        } else {
            passwordErrorMessage.classList.add('hidden');
            isPasswordValid = true;
        }
    }
});

signinBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!isUsernameValid) {
        usernameErrorMessage.classList.remove('hidden');
    } else {
        usernameErrorMessage.classList.add('hidden');
    }

    if (!isPasswordValid) {
        passwordErrorMessage.classList.remove('hidden');
    } else {
        passwordErrorMessage.classList.add('hidden');
    }

    if (isUsernameValid && isPasswordValid) {
        successModal.classList.remove('hidden');
    }
});

modalCloseButton.addEventListener('click', () => {
    successModal.classList.add('hidden');
});

successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.add('hidden');
    }
});
