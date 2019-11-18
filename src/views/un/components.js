const translateStaticElements = require('../common/js/language-utils').translateStaticElements;

class ImageFlagComponent {
    constructor(elId, language, formatFlagPath, savedImgFlagPath) {
        this.container = document.querySelector(elId);
        this.language = language;

        this.formatFlagPath = formatFlagPath;

        this.setCurrentImage(savedImgFlagPath);

        this.render();
    }

    render() {
        this.src = this.currentImgPath;
    }

    setCurrentImage(currentImgPath) {
        if (currentImgPath) {
            this.currentImgPath = currentImgPath;
        } else {
            this.currentImgPath = this.formatFlagPath;
        }
    }
}

module.exports.ImageFlagComponent = ImageFlagComponent;

class SpeakerListComponent {
    constructor(elId, language, delegates, savedSpeakers) {
        this.container = document.querySelector(elId);

        this.language = language;
        this.fn = null;
    }


    
}

module.exports.SpeakerListComponent = SpeakerListComponent;