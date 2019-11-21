const translateStaticElements = require('../js/language-utils').translateStaticElements;
const _getMatching = require('../js/string-utils')._getMatching;

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

module.exports = WarningsComponent;