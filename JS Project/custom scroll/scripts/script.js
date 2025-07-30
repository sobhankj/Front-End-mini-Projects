const progressBar = document.querySelector('.progress-bar');

document.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scrollPercentage = scrollY / (document.body.scrollHeight - window.innerHeight);
    progressBar.style.width = `${scrollPercentage * 100}%`;
});
