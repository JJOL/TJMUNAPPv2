/*
 * translateStaticElements(container, language)
 * finds every child element of container with data tag 'data-strname' and
 * replaces its innerHTML content with according language strname string.
*/
function translateStaticElements(container, language) {
    let keyEls = Array.from(container.querySelectorAll('[data-strname]'));
    for (let el of keyEls) {
        let key = el.dataset['strname'];
        el.innerHTML = language.getString(key, language.getActiveLang());
    }
}

module.exports.translateStaticElements = translateStaticElements;