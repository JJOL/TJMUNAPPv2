const translateStaticElements = require('../js/language-utils').translateStaticElements;

const _getMatching = require('../js/string-utils')._getMatching;

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

        let prevPlace = this.speakerIn.placeholder;
        this.speakerIn.placeholder = `${prevPlace} ${this.language.getString('search_placeholder', this.language.getActiveLang())}`;
        this.render();
    }

    _calculateListsDimensions() {
        let speakerContRect = this.speakerContainer.getBoundingClientRect();
        let panelContRect = this.speakerListCtrs.getBoundingClientRect();

        // Calculate Height
        let totalheight = speakerContRect.height;
        let usedHeight  = panelContRect.height;

        let leftHeight = Math.ceil(totalheight - usedHeight - 5);
        let searcherHeight = Math.ceil(leftHeight-usedHeight-5);

        this.speakerList.style.height = `${leftHeight}px`;
        this.resultsList.style.height = `${searcherHeight}px`;

        // Calculate MidPoint
        this.middleHeight = (leftHeight/2);
        this.middleY = this.speakerList.getBoundingClientRect().y + this.middleHeight;
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
        let cleanSepakers = speakers.map(this.cleanedSpeaker);

        if (this.onSpeakerListChangefn) {
            this.onSpeakerListChangefn(cleanSepakers);
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

    cleanedSpeaker(speaker) {
        let copy = {};
        Object.assign(copy, speaker);

        // Remove Extra Parameters to Make it Clean
        delete copy['active'];
        
        return copy;
    }

    renderSpeakers() {
        let htmlStr = '';
        this.speakerList.innerHTML = '';
        for (let i=0; i < this.speakers.length; i++) {
            let speaker = this.speakers[i];
            let disableClass = speaker.passed ? 'disabled' : null;
            let activeClass = speaker.active ? 'active' : null;
            let liEl = document.createElement('li');
            liEl.id = `sp-${i}`;
            liEl.classList.add('list-group-item');
            if (disableClass) liEl.classList.add(disableClass);
            if (activeClass) liEl.classList.add(activeClass);

            let txt = document.createTextNode(`${i+1}. ${speaker.name}`);

            let delEl = document.createElement('span');
            delEl.innerHTML = 'X';
            delEl.classList.add('del-btn');
            delEl.addEventListener('click', () => {
                this.removeSpeaker(i);
            });

            liEl.appendChild(txt);
            liEl.appendChild(delEl);

            this.speakerList.appendChild(liEl);
            // htmlStr += `<li class="list-group-item${disableClass}${activeClass}">${i}. ${speaker.name} <span class="del-btn">X</span></li>`;
        }
        
        // this.speakerList.innerHTML = htmlStr;
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

        if (result.active) {
            delete result.active;
        }
        this.speakers.push(this.cleanedSpeaker(result));
        this.setSpeakerList(this.speakers);
    }

    processSearchInput() {
        let query = this.speakerIn.value;
        
        this.resultDelegates = _getMatching(query, this.delegates);
        
        this.render();
    }

    removeSpeaker(speakerIndex) {
        console.log(speakerIndex);
        
        this.speakers.splice(speakerIndex, 1);
        this.setSpeakerList(this.speakers);
        this.render();
    }

    clearSpeakerList() {
        this.setSpeakerList([]);
        this.render();

        this.forwardSpeakerList();
    }

    forwardSpeakerList() {
        let found = false;
        let speakers = this.speakers;
        let speakerIndex = -1;
        let firstNotPassed = -1;
        for (let i = 0; i < speakers.length; i++) {
            // 
            if (!speakers[i].passed && firstNotPassed == -1) {
                firstNotPassed = i;
            }

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

        if (!found && firstNotPassed != -1) {
            speakers[firstNotPassed].active = true;
            speakerIndex = firstNotPassed;
        }

        this.setSpeakerList(this.speakers);

        if (this.onCurrentSpeakerChangeFn) {
            this.onCurrentSpeakerChangeFn(this.speakers[speakerIndex]);
        }

        this.renderSpeakers();

        // SCROLL LIST
        this.scrollToPresent(speakerIndex);
    }

    scrollToPresent(speakerIndex) {
        if (speakerIndex === -1) {
            return;
        }

        let spEl = this.speakerList.querySelector(`#sp-${speakerIndex}`);
        let elY = spEl.getBoundingClientRect().y;
        let elH = spEl.getBoundingClientRect().height -5;

        if (elY > this.middleY) {
            let dist =  elY - this.middleY;
            console.log(dist);
            
            this.speakerList.scroll(0, this.speakerList.scrollTop +dist + elH);
        }
    }

    onCurrentSpeakerChanged(fn) {
        this.onCurrentSpeakerChangeFn = fn;
    }

    onSpeakerListChanged(fn) {
        this.onSpeakerListChangefn = fn;
    }

}

module.exports = SpeakerListComponent;