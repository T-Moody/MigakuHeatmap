export function getElements(selector) {
    return Array.from(document.querySelectorAll(selector));
}

export function removeElements(selectors) {
    selectors.forEach(selector => {
        getElements(selector).forEach(el => el.remove());
    });
}