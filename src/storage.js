

function setStorageElement(key, val) {
    localStorage.setItem(key, val);
}

function getStorageElement(key, def) {
    return localStorage.getItem(key) || def;
}

function setStorageObj(key, val) {
    setStorageElement(key, JSON.stringify(val));
}

function getStorageObj(key, def) {
    return JSON.parse(getStorageElement(key, null)) || def;
}

module.exports = {
    get: getStorageElement,
    getObj: getStorageObj,
    set: setStorageElement,
    setObj: setStorageObj
}