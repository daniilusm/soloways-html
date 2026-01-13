import Swiper, { FreeMode } from 'swiper';

document.addEventListener('DOMContentLoaded', () => {
    const teaList = document.querySelector('.tea-list');

    if (!teaList) {
        return;
    }

    Swiper.use([FreeMode]);

    /* eslint-disable no-unused-vars  */
    const swiper = new Swiper(teaList, {
        slidesPerView : 'auto',
        freeMode      : true,
    });
    /* eslint-enable no-unused-vars */
});
