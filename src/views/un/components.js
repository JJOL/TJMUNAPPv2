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
        this.speakerContainer = this.container.querySelector('#speaker-list-container');
        this.searcherContainer = this.container.querySelector('#add-searcher-container');
        this.speakerList = this.container.querySelector('#speaker-list');
        this.resultsList = this.container.querySelector('#search-results');
        this.speakerListCtrs = this.speakerContainer.querySelector('.action-controls');

        this.clearBtn = this.speakerContainer.querySelector('#sp-clear-btn');
        this.nextBtn = this.speakerContainer.querySelector('#sp-next-btn');
        this.addBtn = this.speakerContainer.querySelector('#sp-add-btn');
        this.backBtn = this.searcherContainer.querySelector('#sp-back-btn');

        this.speakerIn = this.searcherContainer.querySelector('#sp-input');

        this.language = language;
        this.onSpeakerListChangefn = null;
        this.onCurrentSpeakerChangeFn = null;

        this.delegates = delegates;
        this.speakers = savedSpeakers || [];
        this.resultDelegates = [];


        this._calculateListsDimensions();

        this.addBtn.addEventListener('click', () => {
            this.openAddPanel();
        });
        this.clearBtn.addEventListener('click', () => {
            this.clearSpeakerList();
        });
        this.nextBtn.addEventListener('click', () => {
            this.forwardSpeakerList();
        });

        this.backBtn.addEventListener('click', () => {
            this.closeAddPanel();
        });

        this.speakerIn.addEventListener('keyup', (ev) => {
            this.processSearchInput();
        });

        this.render();
    }

    _calculateListsDimensions() {
        let totalheight = this.speakerContainer.getBoundingClientRect().height;
        let usedHeight  = this.speakerListCtrs.getBoundingClientRect().height;

        let leftHeight = Math.ceil(totalheight - usedHeight - 5);
        let searcherHeight = Math.ceil(leftHeight-usedHeight-5);

        this.speakerList.style.height = `${leftHeight}px`;
        this.resultsList.style.height = `${searcherHeight}px`;
    }

    _getMatching(query, delegates) {
        let matching = [];
        query = query.toLowerCase();
        for (let del of delegates) {
            let testName = del.name.toLowerCase();
            if (testName.startsWith(query)) {
                matching.push(del);
            }
        }
        return matching;
    }

    setSpeakerList(speakers) {
        this.speakers = speakers;
        if (this.onSpeakerListChangefn) {
            this.onSpeakerListChangefn(this.speakers);
        }
    }

    isInSpeakerList(delegate) {
        for (let speaker of this.speakers) {
            if (speaker.name === delegate.name) {
                return true;
            }
        }

        return false;
    }

    renderSpeakers() {
        let htmlStr = '';
        let i = 1;
        for (let speaker of this.speakers) {
            let disableClass = speaker.passed ? ' disabled' : '';
            let activeClass = speaker.active ? ' active' : '';
            htmlStr += `<li class="list-group-item${disableClass}${activeClass}">${i}. ${speaker.name}</li>`;
            i++;
        }
        
        this.speakerList.innerHTML = htmlStr;
    }

    renderSearchResults() {
        this.resultsList.innerHTML = '';
        let i = 0;
        for (let result of this.resultDelegates) {
            let rIndex = i;
            let el = document.createElement('li');
            el.classList.add('list-group-item');
            let used = this.isInSpeakerList(result);
            if (used) {
                el.classList.add('disabled');
            }
            el.innerHTML = `${result.name}`;
            el.addEventListener('click', () => {
                if (!used) {
                    this.selectOption(rIndex);
                    this.render();
                }    
            });

            this.resultsList.appendChild(el);

            i++;
        }        
    }

    render() {
        this.renderSpeakers();  
        this.renderSearchResults();      
        translateStaticElements(this.container, this.language);
    }

    openAddPanel() {
        this.speakerContainer.classList.remove('active');
        this.searcherContainer.classList.add('active');
        this.processSearchInput();
    }

    closeAddPanel() {
        this.speakerContainer.classList.add('active');
        this.searcherContainer.classList.remove('active');
    }

    selectOption(resultIndex) {
        let result = this.resultDelegates[resultIndex];
        this.speakers.push(result);
        this.setSpeakerList(this.speakers);
    }

    processSearchInput() {
        let query = this.speakerIn.value;
        
        this.resultDelegates = this._getMatching(query, this.delegates);
        
        this.render();
    }

    clearSpeakerList() {
        this.speakers = [];
        this.setSpeakerList(this.speakers);
        this.render();
    }

    forwardSpeakerList() {
        let found = false;
        let speakers = this.speakers;
        let speakerIndex = -1;
        for (let i = 0; i < speakers.length; i++) {
            if (speakers[i].active) {                
                speakers[i].active = false;
                speakers[i].passed = true;
                if (i+1 < speakers.length) {
                    speakers[i+1].active = true;
                    speakerIndex = i+1;
                }

                found = true;
                break;
            }
        }

        if (!found && speakers.length > 0) {
            speakers[0].active = true;
            speakerIndex = 0;
        }

        this.setSpeakerList(this.speakers);

        if (this.onCurrentSpeakerChangeFn) {
            this.onCurrentSpeakerChangeFn(this.speakers[speakerIndex]);
        }

        this.renderSpeakers();
    }

    onCurrentSpeakerChanged(fn) {
        this.onCurrentSpeakerChangeFn = fn;
    }

    onSpeakerListChanged(fn) {
        this.onSpeakerListChangefn = fn;
    }

}

module.exports.SpeakerListComponent = SpeakerListComponent;