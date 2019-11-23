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

        // Correct Height to Fit Aspect Ratio 5/3
        let w = this.container.getBoundingClientRect().width;
        let h = w / (5/3);

        console.log('New height', h);
        

        this.container.style.height = `${h}px`;
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