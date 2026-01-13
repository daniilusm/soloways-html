import ScrollTrigger from 'gsap/ScrollTrigger';

export default class VideoObserver {
    activeElems = []

    constructor() {
        this.init();
    }

    observe(elem) {
        const play = () => {
            elem.play();
        };

        const pause = () => {
            elem.pause();
        };

        ScrollTrigger.create({
            scroller    : '[data-scroll-container]',
            trigger     : elem,
            onEnter     : play,
            onEnterBack : play,
            onLeave     : pause,
            onLeaveBack : pause,
        });

        this.activeElems.push(elem);
    }

    init() {
        const elems = document.querySelectorAll('[data-observe-video]');

        elems.forEach(elem => {
            this.observe(elem);
        });
    }
}
