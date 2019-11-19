class TitleComponent {
    constructor(elId, language, sessionName) {
        this.container = document.querySelector(elId);
        this.container.querySelector('h2').innerHTML = sessionName;
    }
}

module.exports = TitleComponent;