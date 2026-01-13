require('sharer.js');

export default class Sharer {
    constructor() {
        this.init();
    }

    init() {
        const sharer = document.querySelector('.p-recipe__action-item_share');

        if (sharer) {
            if (navigator.canShare) {
                const shareData = {
                    title : sharer.getAttribute('data-share-title'),
                    text  : sharer.getAttribute('data-share-text'),
                    url   : window.location.href,
                };

                sharer.addEventListener('click', () => {
                    navigator.share(shareData);
                });
            }
            else {
                window.Sharer.init();
            }
        }
    }
}
