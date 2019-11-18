const translateStaticElements = require('../common/js/language-utils').translateStaticElements;

const _getMatching = require('../common/js/string-utils')._getMatching;

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
        
        this.resultDelegates = _getMatching(query, this.delegates);
        
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
        let firstNotPassed = -1;
        for (let i = 0; i < speakers.length; i++) {
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
    }

    onCurrentSpeakerChanged(fn) {
        this.onCurrentSpeakerChangeFn = fn;
    }

    onSpeakerListChanged(fn) {
        this.onSpeakerListChangefn = fn;
    }

}

module.exports.SpeakerListComponent = SpeakerListComponent;


class WarningsComponent {
    constructor(elId, language, delegates, savedWarnings) {
        this.container = document.querySelector(elId);
        this.warningTitle = this.container.querySelector('h3');
        this.searchInput = this.container.querySelector('#wg-input');
        this.warningsList = this.container.querySelector('#warnings-list');
        

        this.language = language;
        this.fn = null;
        this.delegates = delegates;
        this.resultDelegates = delegates;
        this.warnings = savedWarnings || {};

        this.searchInput.addEventListener('keyup', () => {
            this.processSearchInput();
        });

        this._calculateListsDimensions();
        let prevPlace = this.searchInput.placeholder;
        this.searchInput.placeholder = `${prevPlace} ${this.language.getString('search_placeholder', this.language.getActiveLang())}`;
        
        this.renderWarningResults();
        translateStaticElements(this.container, this.language);
    }

    _calculateListsDimensions() {
        let totalheight = this.container.getBoundingClientRect().height;
        let titleHeight  = this.warningTitle.getBoundingClientRect().height;
        let searchHeight  = this.searchInput.getBoundingClientRect().height;

        let leftHeight = Math.ceil(totalheight - titleHeight - searchHeight - 25);

        this.warningsList.style.height = `${leftHeight}px`;
    }

    renderWarningResults() {

        this.warningsList.innerHTML = '';

        for (let i=0; i < this.resultDelegates.length; i++) {
            let delegate = this.resultDelegates[i];

            let liEl = document.createElement('li');
            liEl.classList.add('list-group-item', 'row');

            let countryEl = document.createElement('div');
            countryEl.classList.add('col', 'col-md-9');
            countryEl.innerHTML = delegate.name;

            let warnignsEl = document.createElement('div');
            warnignsEl.classList.add('col', 'col-md-3');

            for (let j=0; j < 3; j++) {
                let radioBtn = document.createElement('input');
                radioBtn.type = 'radio';
                let idStr = `w-${delegate.name}-${j}`;
                let warningId = j;
                radioBtn.id = idStr;
                
                if (delegate.name in this.warnings) {
                    radioBtn.checked = this.warnings[delegate.name][warningId];
                }   

                radioBtn.addEventListener('click', (ev) => {
                    ev.preventDefault();                 
                    this.toggleWarning(delegate.name, warningId);
                });

                warnignsEl.appendChild(radioBtn);
            }

            liEl.appendChild(countryEl);
            liEl.appendChild(warnignsEl);
            
            this.warningsList.appendChild(liEl);
        }
    }


    toggleWarning(delName, warningId) {
        // Create Warning Registry if it doesnt exist
        this.warnings[delName] = this.warnings[delName] || {}
        // Toggle Warning Status
        this.warnings[delName][warningId] = !this.warnings[delName][warningId];

        if (this.fn) {
            this.fn(this.warnings);
        }

        this.renderWarningResults();
    }

    processSearchInput() {
        let query = this.searchInput.value;  
        this.resultDelegates = _getMatching(query, this.delegates);
        this.renderWarningResults();
    }


    onInfoChange(fn) {
        this.fn = fn;
    }
}

module.exports.WarningsComponent = WarningsComponent;