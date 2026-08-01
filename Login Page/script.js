const signinBtn = document.querySelector('.signin_button');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const usernameErrorMessage = document.querySelector('.username_error_message');
const passwordErrorMessage = document.querySelector('.password_error_message');
const successModal = document.querySelector('#success_modal');
const modalCloseButton = document.querySelector('.modal_close_button');

signinBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const isUsernameValid = usernameInput.value.length >= 3;
    const isPasswordValid = passwordInput.value.length >= 8;

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
