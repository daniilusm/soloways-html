document.addEventListener('DOMContentLoaded', () => {
    const popupBtns = document.querySelectorAll('.js-popup-btn');
    const overlays = document.querySelectorAll('.js-overlay');
    const crosses = document.querySelectorAll('.js-close');

    if (!popupBtns.length) {
        return;
    }

    popupBtns.forEach(popupBtn => {
        popupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.popup.openPopup(popupBtn.getAttribute('data-popup-type'));
        });
    });

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            window.popup.closePopup();
        });
    });

    crosses.forEach(cross => {
        cross.addEventListener('click', () => {
            window.popup.closePopup();
        });
    });
});
