class ImageFlagComponent {
    constructor(elId, language, formatFlagPath, savedImgFlagPath) {
        this.container = document.querySelector(elId);
        this.language = language;

        this.formatFlagPath = formatFlagPath;

        this.setCurrentImage(savedImgFlagPath);

        this.render();
    }

    render() {
        this.container.src = this.currentImgPath;
    }

    setCurrentImage(currentImgPath) {
        console.log(currentImgPath);
        
        if (currentImgPath) {
            this.currentImgPath = currentImgPath;
        } else {
            this.currentImgPath = this.formatFlagPath;
        }
        this.render();
    }
}

module.exports = ImageFlagComponent;