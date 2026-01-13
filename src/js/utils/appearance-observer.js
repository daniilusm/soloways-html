import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { breakpoints } from '~/js/utils/vars';

export default class AppearanceObserver {
    items = []

    constructor() {
        this.init();
    }

    getCorrectTl(item) {
        const type = item.type;
        const elem = item.elem;

        const tl = gsap.timeline(
            {
                onStart : () => {
                    gsap.set(elem, { willChange: 'transform' });
                },
                onComplete : () => {
                    gsap.set(elem, { willChange: 'auto' });
                },
            },
        );

        switch (type) {
            case 'transitionOpacity':
                tl.from(elem, {
                    y        : 20,
                    opacity  : 0,
                    duration : 2,
                    ease     : 'power2.out',
                });
                break;
            case 'simpleOpacity':
                tl.from(elem, {
                    opacity  : 0,
                    duration : 1.5,
                    ease     : 'power2.out',
                });
                break;
        }

        return tl;
    }

    observe(item) {
        ScrollTrigger.create({
            scroller  : '[data-scroll-container]',
            trigger   : item.elem,
            once      : true,
            start     : 'top 80%',
            animation : this.getCorrectTl(item),
        });
    }

    init() {
        if (window.innerWidth < breakpoints.lg) {
            return;
        }
        const elemsToObserve = document.querySelectorAll('[data-observe-appearance]');

        elemsToObserve.forEach(elem => {
            const type = elem.getAttribute('data-observe-appearance');

            this.items.push({
                elem : elem,
                type : type,
            });
        });

        this.items.forEach(item => {
            this.observe(item);
        });
    }
}
