const scroll = document.querySelector('.scroll');


document.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scrollPercentage = scrollY / (document.body.scrollHeight - window.innerHeight);
    scroll.style.top = `${scrollPercentage * 0.872 * 100}%`;
});
